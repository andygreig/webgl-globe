import { HTMLImageElementWithNeedsUpdate } from "../types";

export const loadImage = (fileName: string): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      const image = new Image() as HTMLImageElementWithNeedsUpdate;
  
      image.onload = () => {
        image.needsUpdate = true;
  
        const imageCanvas = document.createElement("canvas");
        imageCanvas.width = image.width;
        imageCanvas.height = image.height;
  
        const context = imageCanvas.getContext("2d");
        if (context) {
          context.drawImage(image, 0, 0);
  
          const imageData = context.getImageData(
            0,
            0,
            imageCanvas.width,
            imageCanvas.height
          );
  
          resolve(imageData); // Send the imageData back to the caller
        } else {
          reject(new Error("2D context not available"));
        }
      };
  
      image.onerror = (err) => {
        reject(new Error(`Image failed to load: ${err}`));
      };
  
      image.src = fileName as string;
    });
  };