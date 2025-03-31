

var time = document.querySelector(".time_text");
var params = new URLSearchParams(window.location.search);

document.addEventListener('click', () => {
  document.querySelector("body").requestFullscreen();
})

var firstname = params.get("firstname");
var surname = params.get("surname");
var image = params.get("image");

var borndate = params.get("borndate");
var pesel = params.get("pesel");




function hideAddressBar() {
  if (document.documentElement.scrollHeight < window.outerHeight / window.devicePixelRatio)
    document.documentElement.style.height = (window.outerHeight / window.devicePixelRatio) + 'px';
  setTimeout(window.scrollTo(1, 1), 0);
}
window.addEventListener("load", function () { hideAddressBar(); });
window.addEventListener("orientationchange", function () { hideAddressBar(); });

let webManifest = {
  "name": "",
  "short_name": "",
  "theme_color": "#f5f6fb",
  "background_color": "#f5f6fb",
  "display": "standalone"
};

window.addEventListener(
  "touchmove",
  function (event) {
    if (event.scale !== 1) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },
  { passive: false }
);

let manifestElem = document.createElement('link');
manifestElem.setAttribute('rel', 'manifest');
manifestElem.setAttribute('href', 'data:application/manifest+json;base64,' + btoa(JSON.stringify(webManifest)));
document.head.prepend(manifestElem);


document.querySelector(".surname").innerHTML = surname.toUpperCase();
document.querySelector(".firstname").innerHTML = firstname.toUpperCase();

document.querySelector(".pesel").innerHTML = pesel.toUpperCase();
document.querySelector(".borndate").innerHTML = borndate.toUpperCase();

// document.querySelector(".id_own_image").style.backgroundImage = "url('" + image + "')";

// Load saved image from localStorage (if any) and set it as the background
// const savedImage = localStorage.getItem('profileImage');
// if (savedImage) {

//   getImageFromIndexedDB((imageDataUrl) => {
//     document.querySelector('.id_own_image').style.backgroundImage = `url('${imageDataUrl}')`;
//   });

// }

document.addEventListener('DOMContentLoaded', (event) => {
  getImageFromIndexedDB();
});

function getImageFromIndexedDB() {
  const request = indexedDB.open("PWAStorage", 1);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("images")) {
      db.createObjectStore("images", { keyPath: "id" });
    }
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction("images", "readonly");
    const store = transaction.objectStore("images");
    const getRequest = store.get("profileImage");

    getRequest.onsuccess = () => {
      if (getRequest.result) {
        console.log("Retrieved image from IndexedDB:", getRequest.result.data);
        document.querySelector('.id_own_image').style.backgroundImage = `url('${getRequest.result.data}')`;
      } else {
        console.log("No image found in IndexedDB.");
        showImageUploadOption(); // Show upload option if no image found
      }
    };

    getRequest.onerror = (err) => {
      console.error("Error retrieving image from IndexedDB:", err);
    };
  };

  request.onerror = (err) => {
    console.error("Error opening IndexedDB:", err);
  };
}

function showImageUploadOption() {
  console.log("Showing upload option.");

  // Create a container for the overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent background
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '1000'; // Ensures it's on top of other elements

  // Create the upload container
  const uploadContainer = document.createElement('div');
  uploadContainer.style.backgroundColor = '#fff';
  uploadContainer.style.padding = '20px';
  uploadContainer.style.borderRadius = '8px';
  uploadContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
  uploadContainer.innerHTML = `
    <p>Upload your profile image:</p>
    <input type="file" id="image-upload" accept="image/*">
    <button id="close-upload" style="margin-top: 10px;">Cancel</button>
  `;

  // Append the upload container to the overlay
  overlay.appendChild(uploadContainer);
  document.body.appendChild(overlay);

  // Add event listener for file upload
  const imageUploadInput = document.getElementById('image-upload');
  imageUploadInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageDataUrl = e.target.result;
        storeImageInIndexedDB(imageDataUrl); // Store in IndexedDB
        document.querySelector('.id_own_image').style.backgroundImage = `url('${imageDataUrl}')`; // Set as background
        overlay.remove(); // Remove overlay once image is set
      };
      reader.readAsDataURL(file);
    }
  });

  // Add event listener for cancel button to close the overlay
  const closeButton = document.getElementById('close-upload');
  closeButton.addEventListener('click', () => {
    overlay.remove();
  });
}


function storeImageInIndexedDB(imageDataUrl) {
  const request = indexedDB.open("PWAStorage", 1);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("images")) {
      db.createObjectStore("images", { keyPath: "id" });
    }
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction("images", "readwrite");
    const store = transaction.objectStore("images");
    const putRequest = store.put({ id: "profileImage", data: imageDataUrl });

    putRequest.onsuccess = () => {
      console.log("Image stored successfully in IndexedDB.");
    };

    putRequest.onerror = (err) => {
      console.error("Error storing image in IndexedDB:", err);
    };
  };

  request.onerror = (err) => {
    console.error("Error opening IndexedDB:", err);
  };
}





var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
var date = new Date();
document.querySelector(".bottom_update_value").innerHTML = date.toLocaleDateString("pl-PL", options);

setClock();
function setClock() {
  date = new Date();
  time.innerHTML = "Czas: " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " " + date.toLocaleDateString("pl-PL", options);
  delay(1000).then(() => {
    setClock();
  })
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}