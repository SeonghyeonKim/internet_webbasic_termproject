const challenge_link = './html/challenge.html'

document.getElementById("enter_button").onclick = function () {
    let handle = document.getElementById("handle").value;
    localStorage.setItem("handle", handle);

    location.href=challenge_link;
};
