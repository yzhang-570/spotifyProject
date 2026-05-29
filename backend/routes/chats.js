import express from 'express';
import db from '../firebase.js';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  getPublicUsers,
  getUserProfile,
  upsertSessionUser,
} from '../db/usersDB.js';

const router = express.Router();

const requireAuth = (req, res, next) => {
  if (!req.session.user?.id) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  next();
};

const serializeTimestamp = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (value.toDate) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return null;
};

const getChatDocsForUser = async (userId) => {
  const chatsRef = collection(db, 'chats');
  const [asSenderOne, asSenderTwo] = await Promise.all([
    getDocs(query(chatsRef, where('sender_one', '==', userId))),
    getDocs(query(chatsRef, where('sender_two', '==', userId))),
  ]);

  const chatMap = new Map();
  asSenderOne.docs.forEach((chatDoc) => chatMap.set(chatDoc.id, chatDoc));
  asSenderTwo.docs.forEach((chatDoc) => chatMap.set(chatDoc.id, chatDoc));

  return [...chatMap.values()];
};

const findExistingChat = async (currentUserId, recipientId) => {
  const chatsRef = collection(db, 'chats');
  const [forwardQuery, reverseQuery] = await Promise.all([
    getDocs(
      query(
        chatsRef,
        where('sender_one', '==', currentUserId),
        where('sender_two', '==', recipientId)
      )
    ),
    getDocs(
      query(
        chatsRef,
        where('sender_one', '==', recipientId),
        where('sender_two', '==', currentUserId)
      )
    ),
  ]);

  return forwardQuery.docs[0] || reverseQuery.docs[0] || null;
};

const formatChat = async (chatDoc, currentUserId) => {
  const chat = chatDoc.data();
  const otherUserId =
    chat.sender_one === currentUserId ? chat.sender_two : chat.sender_one;
  const otherUser = await getUserProfile(otherUserId);
  const messages = Array.isArray(chat.messages) ? chat.messages : [];

  return {
    id: chatDoc.id,
    sender_one: chat.sender_one,
    sender_two: chat.sender_two,
    otherUser,
    created_time: serializeTimestamp(chat.created_time),
    updated_time: serializeTimestamp(chat.updated_time),
    messages: messages.map((message) => ({
      author: message.author,
      text: message.text,
      sent_time: serializeTimestamp(message.sent_time),
      isCurrentUser: message.author === currentUserId,
    })),
  };
};

router.use(requireAuth);

router.get('/users', async (req, res) => {
  try {
    await upsertSessionUser(req.session.user);
    const users = await getPublicUsers(req.session.user.id);
    res.json(users);
  } catch (error) {
    console.error('Error fetching chat users:', error);
    res.status(500).json({ error: 'Unable to fetch users.' });
  }
});

router.get('/', async (req, res) => {
  try {
    await upsertSessionUser(req.session.user);
    const chatDocs = await getChatDocsForUser(req.session.user.id);
    const chats = await Promise.all(
      chatDocs.map((chatDoc) => formatChat(chatDoc, req.session.user.id))
    );

    chats.sort((a, b) => {
      const aTime = new Date(a.updated_time || a.created_time || 0).getTime();
      const bTime = new Date(b.updated_time || b.created_time || 0).getTime();
      return bTime - aTime;
    });

    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Unable to fetch chats.' });
  }
});

router.post('/', async (req, res) => {
  const recipientId = req.body.recipientId?.trim();
  const currentUserId = req.session.user.id;

  if (!recipientId) {
    return res.status(400).json({ error: 'Recipient is required.' });
  }

  if (recipientId === currentUserId) {
    return res.status(400).json({ error: 'You cannot start a chat with yourself.' });
  }

  try {
    await upsertSessionUser(req.session.user);
    const existingChat = await findExistingChat(currentUserId, recipientId);

    if (existingChat) {
      return res.json(await formatChat(existingChat, currentUserId));
    }

    const newChatRef = await addDoc(collection(db, 'chats'), {
      sender_one: currentUserId,
      sender_two: recipientId,
      messages: [],
      created_time: serverTimestamp(),
      updated_time: serverTimestamp(),
    });
    const newChatSnap = await getDoc(newChatRef);

    res.status(201).json(await formatChat(newChatSnap, currentUserId));
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: 'Unable to create chat.' });
  }
});

router.post('/:chatId/messages', async (req, res) => {
  const text = req.body.text?.trim();
  const currentUserId = req.session.user.id;

  if (!text) {
    return res.status(400).json({ error: 'Message text is required.' });
  }

  try {
    const chatRef = doc(db, 'chats', req.params.chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      return res.status(404).json({ error: 'Chat not found.' });
    }

    const chat = chatSnap.data();
    const isParticipant =
      chat.sender_one === currentUserId || chat.sender_two === currentUserId;

    if (!isParticipant) {
      return res.status(403).json({ error: 'You do not have access to this chat.' });
    }

    await updateDoc(chatRef, {
      messages: arrayUnion({
        author: currentUserId,
        text,
        sent_time: Timestamp.now(),
      }),
      updated_time: serverTimestamp(),
    });

    const updatedChatSnap = await getDoc(chatRef);
    res.json(await formatChat(updatedChatSnap, currentUserId));
  } catch (error) {
    console.error('Error sending chat message:', error);
    res.status(500).json({ error: 'Unable to send message.' });
  }
});

export default router;
