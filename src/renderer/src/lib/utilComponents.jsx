export const getHoverEffectForType = (type) => {
    console.log();
    
    if (!type) {
      return null
    }
    switch (type.toLowerCase()) {
      case "plaer-link":
console.log('Triggered');

        return (
          <>
            <div className="absolute inset-0 bg-black transition  ease-in-out  duration-300 opacity-0 hover:opacity-50"></div>
            <PlayIcon
              src="overlay-image-url.png"
              alt="Overlay Image"
              className="text-white absolute z-20 inset-0 w-20 h-20 object-cover opacity-0 group-hover:opacity-100 mx-auto my-auto pointer-events-none"
            />
          </>
        )
      case "artist":
        return "ring"
      case "playlist":
        return "ring"
      case "song":
        return "ring"
      default:
        return "ring"
    }
  }
  