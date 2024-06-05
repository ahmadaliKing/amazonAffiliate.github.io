
// Set a timeout for 5 seconds
let loadTimeout = setTimeout(function () {
    location.reload();
}, 5000); // 5000 milliseconds = 5 seconds

// Clear the timeout if the page loads within 5 seconds
window.addEventListener("load", function () {
    clearTimeout(loadTimeout);
});


// preloader
window.addEventListener('load', () => {
    document.querySelector('.preloader').style.display = 'none';
})
//

// sticky header
let header = document.getElementsByClassName("header")[0];
let input = document.querySelector("input");
let headerHeight = header.offsetHeight;
let isHeaderSticky = false;

window.addEventListener("scroll", function () {
    let scrollPosition = window.scrollY;

    if (scrollPosition > headerHeight && !isHeaderSticky) {
        // Header becomes sticky
        header.classList.add("sticky");
        input.classList.add('sticky')
        isHeaderSticky = true;
        setTimeout(function () {
            header.classList.add("fade-out");
        }, 100); // Delay fade-out for smooth transition

        setTimeout(function () {
            header.classList.remove("fade-out");
        }, 300);
    } else if (scrollPosition <= headerHeight && isHeaderSticky) {
        // Header scrolls back to the top
        input.classList.remove('sticky')
        header.classList.remove("fade-out");
        header.classList.remove("sticky");
        isHeaderSticky = false;
        // Delay fade-in for smooth transition
    }
});


// 

const content = document.getElementsByClassName('img-container')[0];;
const loader = document.getElementById('loader');

let dataset_cat = [];

fetch('card.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        for (index = 0; index < data.length; index++) {

            let div_card = document.createElement('div')
            div_card.setAttribute('class', 'card')
            div_card.setAttribute('data-category', `${data[index].category}`);
            let html = `

            <a target='_blank' href="${data[index].affiliate_link}">
                <img src="${data[index].img_url}">
            </a>
        
         `;

            div_card.insertAdjacentHTML("afterbegin", html);
            content.insertBefore(div_card, content.firstElementChild);

            dataset_cat.push(data[index].category);

        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });








// -----------------------------------------------------------------------------------------------------------


// search input   &&& auto-complete input


let search_img = () => {
    const searchTerm = document.querySelector('.autocomplete input').value.toLowerCase();
    const items = document.querySelectorAll('.card');

    items.forEach(function (item) {

        if (item.dataset.category.toUpperCase().substr(0, searchTerm.length) == searchTerm.toUpperCase()) {
            item.style.display = '';

        } else {
            item.style.display = 'none';
        }
    });

    let children = content.children;

    // Array to store child elements with display: block
    let blockChildren = [];

    // Iterate through each child element
    for (let i = 0; i < children.length; i++) {
        // Get the computed style of the child element
        let computedStyle = window.getComputedStyle(children[i]);

        // Check if the display property is set to block
        if (computedStyle.display === "block") {
            // If display is block, add it to the blockChildren array
            blockChildren.push(children[i]);
        }
    }
    if (blockChildren.length > 0) {
        document.querySelector('.no-item').style.display = 'none';
        document.querySelector('.footer').classList.remove('fixed')
    } else {
        document.querySelector('.footer').classList.add('fixed')
        document.querySelector('.no-item').style.display = 'block'


    }

}





document.addEventListener("DOMContentLoaded", function () {
    let countries = dataset_cat;

    function autocomplete(inp, arr) {
        let currentFocus;

        inp.addEventListener("input", function () {
            let val = this.value;
            closeAllLists();

            if (!val) { return false; }
            currentFocus = -1;

            let a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            this.parentNode.appendChild(a);

            for (let i = 0; i < arr.length; i++) {
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    // Check for duplicates and remove them
                    let existingDivs = a.getElementsByTagName("DIV");
                    let exists = false;

                    for (let j = 0; j < existingDivs.length; j++) {
                        if (existingDivs[j].getElementsByTagName("input")[0].value === arr[i]) {
                            exists = true;
                            break;
                        }
                    }

                    // If the entry does not exist, create and append it
                    if (!exists) {
                        let b = document.createElement("DIV");
                        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                        b.innerHTML += arr[i].substr(val.length);
                        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                        b.addEventListener("click", function () {
                            inp.value = this.getElementsByTagName("input")[0].value;
                            closeAllLists();
                        });
                        a.appendChild(b);
                    }
                    // If no matches found, display a message

                }

            }



        });

        inp.addEventListener("input", function (e) {
            let x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) { // Down key
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) { // Up key
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) { // Enter key
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                }
            }

            // Call search_img() on keydown
            search_img();
        });

        function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            x[currentFocus].classList.add("autocomplete-active");
        }

        function removeActive(x) {
            for (let i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }

        function closeAllLists(elmnt) {
            let x = document.getElementsByClassName("autocomplete-items");
            for (let i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }

        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
            search_img();
        });
    }

    autocomplete(document.getElementById("search-input"), countries);
});




// footer fade show

window.addEventListener("scroll", function () {
    let footer = document.getElementsByClassName("footer")[0];
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        footer.classList.add("show");
    } else {
        footer.classList.remove("show");
    }


});



