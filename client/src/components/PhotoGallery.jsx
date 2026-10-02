import { useState } from 'react';

export default function PhotoGallery({ photos, titre }) {
  const [index, setIndex] = useState(0);

  if (photos.length === 0) {
    return <div className="galerie-vide">Aucune photo pour ce logement</div>;
  }

  return (
    <div className="galerie">
      <img className="galerie-principale" src={photos[index]} alt={`${titre}, photo ${index + 1}`} />
      {photos.length > 1 && (
        <div className="galerie-miniatures">
          {photos.map((p, i) => (
            <button
              key={p}
              type="button"
              className={i === index ? 'actif' : ''}
              onClick={() => setIndex(i)}
              aria-label={`Voir la photo ${i + 1}`}
            >
              <img src={p} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
