// Toggle selector box
var selector = document.querySelector(".selector_box");
selector.addEventListener('click', () => {
    selector.classList.toggle("selector_open");
});

// Remove error class when clicking on a date input
document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener('click', () => {
        document.querySelector(".date").classList.remove("error_shown");
    });
});

var sex = "m";

// Handle selector options
document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        sex = option.id;
        document.querySelector(".selected_text").innerHTML = option.innerHTML;
    });
});

// Image Upload Handling
var upload = document.querySelector(".upload");

// Create hidden file input
var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.jpg,.png,.gif";

// Remove error when clicking on inputs
document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");
    input.addEventListener('click', () => {
        element.classList.remove("error_shown");
    });
});

// Click event to open file selector
upload.addEventListener('click', () => {
    imageInput.click();
    upload.classList.remove("error_shown");
});

imageInput.addEventListener('change', (event) => {
    var file = imageInput.files[0];

    if (!file) return; // Prevent errors if no file is selected

    // Local preview before upload
    var reader = new FileReader();
    reader.onload = function(e) {
        var imgElement = upload.querySelector(".upload_uploaded");
        if (!imgElement) {
            imgElement = document.createElement("img");
            imgElement.classList.add("upload_uploaded");
            upload.appendChild(imgElement);
        }
        imgElement.src = e.target.result; // Show local preview
    };
    reader.readAsDataURL(file);

    // Upload to Imgur
    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");
    upload.removeAttribute("selected");

    var data = new FormData();
    data.append("image", file);

    fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
            'Authorization': 'Client-ID 4ecc257cbb25ccc'
        },
        body: data
    })
    .then(response => response.json())
    .then(response => {
        console.log("Imgur API Response:", response); // Debugging

        if (response.success && response.data.link) {
            var url = response.data.link;
            upload.classList.remove("error_shown");
            upload.setAttribute("selected", url);
            upload.classList.add("upload_loaded");
            upload.classList.remove("upload_loading");

            // Update image with uploaded link
            var imgElement = upload.querySelector(".upload_uploaded");
            if (imgElement) {
                imgElement.src = url;
            }
        } else {
            console.error("Imgur upload failed:", response);
        }
    })
    .catch(error => {
        console.error("Error uploading to Imgur:", error);
    });
});

// Form validation and submission
document.querySelector(".go").addEventListener('click', () => {
    var empty = [];
    var params = new URLSearchParams();
    params.set("sex", sex);

    // Check if an image is uploaded
    if (!upload.hasAttribute("selected")) {
        empty.push(upload);
        upload.classList.add("error_shown");
    } else {
        params.set("image", upload.getAttribute("selected"));
    }

    // Process birthday inputs
    var birthday = "";
    var dateEmpty = false;
    document.querySelectorAll(".date_input").forEach((element) => {
        birthday += "." + element.value;
        if (isEmpty(element.value)) {
            dateEmpty = true;
        }
    });

    birthday = birthday.substring(1); // Remove leading dot

    if (dateEmpty) {
        var dateElement = document.querySelector(".date");
        dateElement.classList.add("error_shown");
        empty.push(dateElement);
    } else {
        params.set("birthday", birthday);
    }

    // Validate input fields
    document.querySelectorAll(".input_holder").forEach((element) => {
        var input = element.querySelector(".input");

        if (isEmpty(input.value)) {
            empty.push(element);
            element.classList.add("error_shown");
        } else {
            params.set(input.id, input.value);
        }
    });

    // Scroll to first error or submit
    if (empty.length !== 0) {
        empty[0].scrollIntoView();
    } else {
        forwardToId(params);
    }
});

// Check if a value is empty
function isEmpty(value) {
    return /^\s*$/.test(value);
}

// Redirect with parameters
function forwardToId(params) {
    location.href = "/id?" + params;
}

// Toggle guide section
var guide = document.querySelector(".guide_holder");
guide.addEventListener('click', () => {
    guide.classList.toggle("unfolded");
});
