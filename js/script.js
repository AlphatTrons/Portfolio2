// Simulate an admin check (in reality, this would come from your backend)
const isAdmin = true;  // Set to true or false to simulate admin privileges

// Comment Form Submit Event
const commentForm = document.getElementById('comment-form');
const usernameInput = document.getElementById('username');
const commentInput = document.getElementById('comment');
const commentList = document.getElementById('comment-list');

// Store comments in an array (this could be replaced with a backend database)
let comments = [];

// Function to display comments
function displayComments() {
    commentList.innerHTML = '';
    comments.forEach((comment, index) => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        
        // If comment is from admin, add a special class
        if (comment.isAdmin) {
            commentElement.classList.add('admin');
        }

        // Set comment content
        commentElement.innerHTML = `
            <h4>${comment.username}</h4>
            <p>${comment.text}</p>
            <button class="delete-btn" onclick="deleteComment(${index})">Delete</button>
        `;

        // Append comment to the list
        commentList.appendChild(commentElement);
    });
}

// Function to handle comment form submission
commentForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Check if username and comment are provided
    if (usernameInput.value.trim() === "" || commentInput.value.trim() === "") {
        alert("Please fill out both the username and comment fields.");
        return;
    }

    const newComment = {
        username: usernameInput.value,
        text: commentInput.value,
        isAdmin: false // Set to false for normal users
    };

    // Add the new comment to the comments array
    comments.push(newComment);

    // Reset form fields
    usernameInput.value = '';
    commentInput.value = '';

    // Display updated comments
    displayComments();
});

// Function to delete a comment (only available to admin)
function deleteComment(index) {
    if (isAdmin) {
        comments.splice(index, 1);
        displayComments();
    } else {
        alert('You do not have permission to delete comments.');
    }
}

// Function to add an "edit" feature for comments (optional)
function editComment(index) {
    const comment = comments[index];
    const newCommentText = prompt("Edit your comment:", comment.text);

    if (newCommentText !== null && newCommentText.trim() !== "") {
        comments[index].text = newCommentText;
        displayComments();
    }
}

// Display any existing comments on page load
displayComments();

// Scroll Progress Indicator (new feature)
const scrollIndicator = document.getElementById('scroll-indicator');

// Track scroll progress
window.addEventListener('scroll', () => {
    const scrollPosition = document.documentElement.scrollTop;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollPosition / totalHeight) * 100;
    scrollIndicator.style.width = scrollPercent + '%';
});

// Lazy Loading Images (new feature)
const lazyImages = document.querySelectorAll('img.lazy');

const loadImage = (image) => {
    const src = image.getAttribute('data-src');
    if (src) {
        image.setAttribute('src', src);
        image.classList.remove('lazy');
    }
};

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadImage(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

lazyImages.forEach(image => imageObserver.observe(image));

// Parallax Effect (new feature)
const parallaxElements = document.querySelectorAll('.parallax');

window.addEventListener('scroll', () => {
    parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-speed');
        element.style.transform = `translateY(${window.scrollY * speed}px)`;
    });
});

// Array to store the trail elements
let trailElements = [];

// Limit the number of trail elements to avoid performance issues
const MAX_TRAIL_LENGTH = 20;

function createCursorTrail(e) {
    // Get the current mouse position
    const cursorX = e.clientX;
    const cursorY = e.clientY;

    // Create a new trail element (circle)
    const trail = document.createElement("div");
    trail.classList.add("cursor-trail");

    // Set the position of the trail segment
    trail.style.left = `${cursorX - 5}px`; // Adjust to center the trail segment
    trail.style.top = `${cursorY - 5}px`;  // Adjust to center the trail segment

    // Add the trail segment to the body
    document.body.appendChild(trail);

    // Add the trail segment to the array
    trailElements.push(trail);

    // If the trail exceeds the max length, remove the oldest segment
    if (trailElements.length > MAX_TRAIL_LENGTH) {
        const firstTrail = trailElements.shift();
        firstTrail.remove();
    }
}

// Listen for mousemove events and create the cursor trail
document.addEventListener("mousemove", createCursorTrail);

// Function to handle comment submission
document.getElementById('comment-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const comment = document.getElementById('comment').value;

    fetch('/add-comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, comment })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            loadComments();  // Refresh the comment list
        } else {
            alert(data.error);
        }
    })
    .catch(err => console.error('Error adding comment:', err));
});

// Function to load comments and display them
function loadComments() {
    fetch('/comments')
        .then(response => response.json())
        .then(data => {
            const commentList = document.getElementById('comment-list');
            commentList.innerHTML = ''; // Clear existing comments

            data.forEach(comment => {
                const commentItem = document.createElement('div');
                commentItem.classList.add('comment-item');
                commentItem.innerHTML = `
                    <p><strong>${comment.username}</strong>: ${comment.comment}</p>
                    <small>${comment.timestamp}</small>
                    <button onclick="deleteComment(${comment.id})">Delete</button>
                `;
                commentList.appendChild(commentItem);
            });
        })
        .catch(err => console.error('Error loading comments:', err));
}

// Function to handle deleting a comment
function deleteComment(id) {
    fetch(`/delete-comment/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            loadComments();  // Refresh the comment list
        } else {
            alert(data.error);
        }
    })
    .catch(err => console.error('Error deleting comment:', err));
}

// Load comments when the page loads
document.addEventListener('DOMContentLoaded', loadComments);

// Function to handle active link highlighting based on scroll position
document.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(currentSection)) {
            link.classList.add('active');
        }
    });
});

let lastScrollTop = 0; // Store the last scroll position
const navbar = document.querySelector('.navbar'); // Select the navbar

window.addEventListener('scroll', function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // If the current scroll is greater than the last scroll position (scrolling down)
    if (currentScroll > lastScrollTop) {
        // Scrolling down: Hide the navbar
        navbar.classList.remove('visible');
    } else {
        // Scrolling up: Show the navbar
        navbar.classList.add('visible');
    }
    
    // Update the last scroll position to the current one
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Prevent negative values
});

// Optional: Adding interactivity to contacts
document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('mouseover', () => {
        card.querySelector('.contact-info').style.color = '#333'; // Change text color on hover
    });
    card.addEventListener('mouseout', () => {
        card.querySelector('.contact-info').style.color = '#666'; // Reset text color
    });
});
