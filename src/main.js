// 메인 페이지 url
const challenge_link = './html/challenge.html'

// 로그인 후 메인 페이지로 이동
document.getElementById("enter_button").onclick = function () {
    let handle = document.getElementById("handle").value;
    localStorage.setItem("handle", handle);

    location.href=challenge_link;
};


// 엔터키로도 작동
document.addEventListener("keyup", function (event) {
    if(event.code == `Enter`) {
        let handle = document.getElementById("handle").value;
        localStorage.setItem("handle", handle);

        location.href=challenge_link;
    }
});