import CollectionCard from './collectionCard'

const CollectionsSection = ({ userProfileData, showAll = false }) => {
  const showTopSongs = showAll || !userProfileData.top_songs_isPrivate;
  const showTopArtists = showAll || !userProfileData.top_artists_isPrivate;
  const showLikedSongs = showAll || !userProfileData.liked_songs_isPrivate;

  const noneVisible = !showTopSongs && !showTopArtists && !showLikedSongs;

  return (
    <section className="collectionsection-div">
      {noneVisible && (
        <div className="collectionsection-is-empty">
          <p style={{ color: '#999999' }}>No collections displayed.</p>
        </div>
      )}

      {showTopSongs && (
        <CollectionCard
          text={'Top Songs'}
          navLink={'/top-songs'}
          imageLink={userProfileData?.topSongs?.[0]?.album?.images?.[0]?.url}
          styles={{ '--div-color': '#648DA4', '--div-color-hover': '#517184' }}
        />
      )}
      {showTopArtists && (
        <CollectionCard
          text={'Top Artists'}
          navLink={'/top-artists'}
          imageLink={userProfileData?.topArtists?.[0]?.images?.[0]?.url}
          styles={{ '--div-color': '#A46488', '--div-color-hover': '#83506d' }}
        />
      )}
      {showLikedSongs && (
        <CollectionCard
          text={'Liked Songs'}
          navLink={'/liked-songs'}
          imageLink={userProfileData?.likedSongs?.[0]?.track?.album?.images?.[0]?.url}
          styles={{ '--div-color': '#87AB72', '--div-color-hover': '#729161' }}
        />
      )}
    </section>
  );
};

export default CollectionsSection;
