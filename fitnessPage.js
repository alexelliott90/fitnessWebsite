//declare arrays and variables
let savedItemArray = []
let likedItems = []
let savedItemCount = 0
let commentsArray = []
let messagesArray = []

//create object constructor for saved text item
function SavedItem(title, content, checkboxId, checkboxBoxId, type) {
    this.title = title
    this.content = content
    this.checkboxId = checkboxId
    this.checkboxBoxId = checkboxBoxId
    this.type = type
}

//object constructor for liked items
function LikedItem(checkboxId, checkboxBoxId, likeMessageId) {
    this.checkboxId = checkboxId
    this.checkboxBoxId = checkboxBoxId
    this.likeMessageId = likeMessageId
}

//object constructor for user comments
function UserComment(name, comment) {
    this.name = name
    this.comment = comment
}

//object constructor for messages from user to me
function UserMessage(name, emailAddress, message){
    this.name = name
    this.emailAddress = emailAddress
    this.message = message
}

//create a function which creates storage items and only runs when the page is first loaded
function onPageLoad(){
    if (sessionStorage.getItem("hasCodeRunBefore") === null) {
        sessionStorage.setItem("savedItemArray", JSON.stringify(savedItemArray))
        sessionStorage.setItem("savedItemCount", JSON.stringify(savedItemCount))
        sessionStorage.setItem("likedItems", JSON.stringify(likedItems))
        sessionStorage.setItem("messages", JSON.stringify(messagesArray))
        sessionStorage.setItem("comments", JSON.stringify(commentsArray))
        sessionStorage.setItem("hasCodeRunBefore", true)
    }
}

//place title and text content in object
function saveItem(idOfItem, idOfTitle, idOfCheckbox, idOfCheckboxBox, itemType){ 
    savedItemArray = JSON.parse(sessionStorage.getItem("savedItemArray"))
    savedItemCount = JSON.parse(sessionStorage.getItem("savedItemCount"))
    let content = ""
    
    //declare a variable to hold a counter
    let counter = 0

    //test whether the item has already been saved, add to the counter if so and remove the element from the array
    savedItemArray.forEach(element => {
        if(idOfCheckbox === element.checkboxId){
            const indexToRemove = savedItemArray.indexOf(element)
            savedItemArray.splice(indexToRemove, 1)
            counter ++
            savedItemCount --
        }
    });

    //if item is an image, get the source of the image to store as the content, else store the text content
    if(itemType === "image"){
        content = document.getElementById(idOfItem).src
    }else{content = document.getElementById(idOfItem).textContent}

    //if item has not already been saved (counter will be zero), then add the item to the array, otherwise do not duplicate
    if(counter == 0){
        let newObject = new SavedItem(document.getElementById(idOfTitle).textContent, content, idOfCheckbox, idOfCheckboxBox, itemType)
        savedItemArray.push(newObject)
        savedItemCount++
        alert(`You have saved ${savedItemCount} items`)
    }
    //place arrays into session storage
    sessionStorage.setItem("savedItemArray", JSON.stringify(savedItemArray))
    sessionStorage.setItem("savedItemCount", JSON.stringify(savedItemCount))
}

//function to populate the list of text items on the page. These are paragraph items with titles.
function listSavedItems(){
    savedItemArray = JSON.parse(sessionStorage.getItem("savedItemArray"))
    let paragraphs = document.querySelector('#savedInfoList')
    let images = document.querySelector('#savedImages')
    paragraphs.innerHTML = ""
    for(let i = 0 ; i < savedItemArray.length ; i ++){
        //if image, display image item in the image section
        if(savedItemArray[i].type === "image"){
            const imageDisplay = document.createElement("img")
            imageDisplay.src = savedItemArray[i].content
            imageDisplay.className = "exerciseImage rounded"
            images.appendChild(imageDisplay)
        }else{
        //else display content of text item in text section
        const paraTitle = document.createElement("h3")
        const nodeTitle = document.createTextNode(savedItemArray[i].title)
        paraTitle.appendChild(nodeTitle)
        paragraphs.appendChild(paraTitle)

        //display title of saved item
        const para = document.createElement("p")
        const node = document.createTextNode(savedItemArray[i].content)
        para.appendChild(node)
        paragraphs.appendChild(para)
        }
    }
}

//function to allow user to 'like' an element of the webpage
function likeItem(idOfCheckbox, idOfCheckboxBox, idOfLikeMessage){
    likedItems = JSON.parse(sessionStorage.getItem("likedItems"))
    //declare counter
    let counter = 0
    //if no liked items, then like the item
    if(likedItems.length == 0){
        document.getElementById(idOfLikeMessage).style.display = "inline"
        let newLikeObject = new LikedItem(idOfCheckbox, idOfCheckboxBox, idOfLikeMessage)
        likedItems.push(newLikeObject)
    }else{
        //loop through array and check if item has already been liked, if so change the format back and
        //remove from liked items array
        likedItems.forEach(element => {
            if(idOfCheckbox === element.checkboxId){
                document.getElementById(idOfLikeMessage).style.display = "none"
                const indexToRemove = likedItems.indexOf(element)
                likedItems.splice(indexToRemove, 1)
                counter++
            }else{}
            //if counter = 0, then has not been liked and we need to create a new liked item object
            if (counter === 0){
                document.getElementById(idOfLikeMessage).style.display = "inline"
                let newLikeObject = new LikedItem(idOfCheckbox, idOfCheckboxBox, idOfLikeMessage)
                likedItems.push(newLikeObject)
            }else{}
        })
    }
    //store liked items
    sessionStorage.setItem("likedItems", JSON.stringify(likedItems))
}

//function to display which items have already been liked
function displayLikedItems(){
    likedItems = JSON.parse(sessionStorage.getItem("likedItems"))
    let likeableItems = document.getElementsByClassName('fitnessCheckbox')

    //loop through both arrays and set the format of the liked items
    for(let i=0 ; i < likeableItems.length ; i++){
        likedItems.forEach(element => {
            if(likeableItems[i].id == element.checkboxId){
            document.getElementById(element.likeMessageId).style.display = "inline"
            document.getElementById(element.checkboxBoxId).checked = true
            }
        });
    }
}

//function to display which items have been saved
function displaySavedItems(){
    savedItemArray = JSON.parse(sessionStorage.getItem("savedItemArray"))
    let saveableItems = document.getElementsByClassName('fitnessCheckbox')

    //loop through both saved item arrays, and the saveable items, and set the format of the saved item checkboxes to 'checked'
    for(let i=0 ; i < saveableItems.length ; i++){
        savedItemArray.forEach(element => {
            if(saveableItems[i].id == element.checkboxId){
            document.getElementById(element.checkboxBoxId).checked = true
            }
        })
    }
}

//function to allow a user to add a comment
function addUserComment(){
    commentsArray = JSON.parse(sessionStorage.getItem("comments"))
    
    let nameOfUser = document.getElementById("nameForComment").value
    let userComment = document.getElementById("userComment").value
    let newComment = new UserComment(nameOfUser, userComment)

    commentsArray.push(newComment)
    sessionStorage.setItem("comments", JSON.stringify(commentsArray))
    location.reload()
}

//function which creates a message object and pushes to an array, which I can then read
function addMessage(){
    messagesArray = JSON.parse(sessionStorage.getItem("messages"))
    
    let nameOfUser = document.getElementById("nameForMessage").value
    let userEmail = document.getElementById("emailAddressForMessage").value
    let userMessage = document.getElementById("userMessage").value
    let newMessage = new UserMessage(nameOfUser, userEmail, userMessage)

    messagesArray.push(newMessage)
    sessionStorage.setItem("messages", JSON.stringify(messagesArray))
}

//function which lists the last 5 user comments on the home page
function listComments(){
    commentsArray = JSON.parse(sessionStorage.getItem("comments"))
    let commentsDisplay = document.querySelector('#commentsListTitles')
    commentsDisplay.innerHTML = ""

    //only display the last 5 comments, so we need to set the start of the loop
    let commentsIndexStart = Math.max(commentsArray.length-5 , 0)
    //loop through comments and display the 5 most recent
    for(let i = commentsIndexStart ; i < commentsArray.length ; i ++){
        //display name of person who commented
        const paraTitle = document.createElement("h3")
        paraTitle.className = "commentTitle"
        const nodeTitle = document.createTextNode(commentsArray[i].name)
        //generate the date and include this
        let fullDate = new Date()
        let theDate = fullDate.toJSON().slice(0,10) + " - "
        const nodeDate = document.createTextNode(theDate)
        //display date then name
        paraTitle.appendChild(nodeDate)
        paraTitle.appendChild(nodeTitle)
        commentsDisplay.appendChild(paraTitle)

        //display content of comment
        const para = document.createElement("p")
        const node = document.createTextNode(commentsArray[i].comment)
        para.appendChild(node)
        commentsDisplay.appendChild(para)
    }
}

function homePageLoad(){
        onPageLoad()
        listComments()    
}

function childPageLoad(){
    onPageLoad()
    //run function to check the correct 'liked' boxes and display liked message for liked items
    //same for saved items
    displayLikedItems()
    displaySavedItems()
}


//group of functions to run when the saveforlater page is loaded
function saveForLaterOnload(){
    onPageLoad()
    listSavedItems()
}