const all_tier = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ruby']
const all_subtier = ['V', "IV", 'III', 'II', 'I']
let handle = localStorage.getItem("handle");
let user_tier, user_class;

// BOJ ID 출력
document.querySelector('.name').innerHTML = `<b>${handle}</b> 님`

// 로그아웃 및 이전 페이지 이동
document.getElementById('log_out').addEventListener('click', () => {
    localStorage.removeItem("handle", handle);
    location.href='../index.html';
})


// Solved AC 데이터 가져오기
async function getSolvedacUserData() {
    let response = await fetch(`https://solved.ac/api/v3/user/show?handle=${handle}`, {
        method: "GET",
        headers: {
            Accept: 'application/json'
        }
    })

    let data = await response.json();
    user_class = data.class;

    return data;
}

// Solved AC 데이터 적용하기
async function loadSolvedacUserData() {
    let data = await getSolvedacUserData();
    let calculateTier = await calculateSolvedacTier(data.tier);
    let count = document.querySelector('#totalSolvedCount');
    let tier = document.querySelector('#solvedTier');
    let maxstreak = document.querySelector('#solvedMaxStreak');

    count.innerHTML = `<b>${data.solvedCount}</b>`;
    tier.innerHTML = `<b>${calculateTier}</b>`;
    maxstreak.innerHTML = `<b>${data.maxStreak}일</b>`;
}


// Solved AC 티어 계산
async function calculateSolvedacTier(idx) {
    let tier = 0;
    let subtier = 0;

    if(Number.isInteger(idx/5)) {
        tier = Math.floor(idx/5)-1;
    } 
    else {
        tier = Math.floor(idx/5);
    }

    if(idx%5 == 1) {
        subtier = 0;
    }
    else if(idx%5 == 0) {
        subtier = 4;
    }
    else {
        subtier = (idx%5)-1;
    }

    user_tier = tier;

    return `${all_tier[tier]} ${all_subtier[subtier]}`;
}


// 랜덤 문제로 이동하기
const base_url = 'https://solved.ac/api/v3/search/problem?query=';
const boj_url = 'https://acmicpc.net/problem/';
const problem_options = {method: 'GET', headers: {Accept: 'application/json'}};
const all_difficulty = ['*b', '*s', '*g', '*p', '*d', '*r', '*ur'];

async function randomProblemChallenge(difficulty) {
    // 난이도 별
    try{
        if(difficulty <= 6) {
            let problem_url = base_url + all_difficulty[difficulty] + `!@${handle}&sort=random`;
        
            const response = await fetch(problem_url, problem_options);
            const data = await response.json();
    
            if(data.count==0) throw new Error(); 
            else window.open(`${boj_url}${data.items[0].problemId}`);
        }
        // 현재 티어
        else if(difficulty==7) {
            let problem_url = base_url + all_difficulty[user_tier] + `!@${handle}&sort=random`;
    
            const response = await fetch(problem_url, problem_options);
            const data = await response.json();
    
            if(data.count==0) throw new Error(); 
            else window.open(`${boj_url}${data.items[0].problemId}`);
        }
        // 현재 클래스
        else {
            let problem_url = base_url + `c/${user_class}` + `!@${handle}&sort=random`;
    
            const response = await fetch(problem_url, problem_options);
            const data = await response.json();
    
            if(data.count==0) throw new Error(); 
            else window.open(`${boj_url}${data.items[0].problemId}`);
        }
    }
    catch(e) {
        alert("해결 할 수 있는 문제가 없습니다.");
    }
}

// 공유하기 모달 팝업
const popupButton = document.getElementById('wrap_button');
const modal = document.getElementById('modalWrap');
const closeBtn = document.getElementById('closeBtn');

popupButton.onclick = function () {
    modal.style.display = 'block';
}
closeBtn.onclick = function () {
    modal.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


// 카카오 SDK
Kakao.init('ef39bc4ea6c955f7bd3fc1e011c2cc51'); 
let shareProblemNumber = 1000;
let shareButton = document.getElementById("kakaotalk-sharing-btn");

// 카카오톡 공유하기
shareButton.addEventListener('click', () => {
    shareProblemNumber = document.getElementById("share_number").value;
 
    Kakao.Share.sendDefault({
        objectType: 'text',
        text:
            `${shareProblemNumber}번 문제를 풀어봐요!`,
        link: {
            mobileWebUrl: `https://www.acmicpc.net/problem/${shareProblemNumber}`,
            webUrl: `https://www.acmicpc.net/problem/${shareProblemNumber}`
        },
    });
})




// 타이머 기능
let timeFlag = 0;
let timeStart = 0;

// 타이머 시작
document.getElementById("start_button").onclick = function () {
    document.getElementById("start_button").parentElement.style.color="red";
    
    timeFlag = 1;
    timeStart = new Date().getTime();
};

// 타이머 종료 및 시간 알림
document.getElementById("end_button").onclick = function () {
    try {
        if(!timeFlag) throw new Error('Start 버튼을 먼저 누르세요!');
    
        let dis = new Date().getTime() - timeStart;

        document.getElementById("start_button").parentElement.style.color="black";

        alert(`${Math.floor(dis/360000)%60}시 ${Math.floor(dis/60000)%60}분 ${Math.floor(dis/1000)%60}초 지났습니다.`);
        timeFlag = 0;
    }
    catch (e){
        alert(e);
    }
};


// ToDo List 기능
const todoText = document.getElementById("todo_text");
const todoList = document.getElementById("todo_list");
const addTodoButton = document.getElementById("addToDo_button");

const TODO_LIST = "TODO_LIST";
let todoArray = [];

// local storage에 현재 상태 저장
function saveTodoArray() {
    localStorage.setItem(TODO_LIST, JSON.stringify(todoArray));
}

// local storage의 배열 불러오기
function loadTodoArray() {
    const storageArray = localStorage.getItem(TODO_LIST);

    if(storageArray!=null) {
        const parseStorageArray = JSON.parse(storageArray);

        parseStorageArray.forEach(function (todo) {
            addTodo(todo.text);
        });
    }
}

// todo 추가하기
function addTodo(text) {
    const li = document.createElement("li");     
    const removeButton = document.createElement("button");
    const newId = todoArray.length + 1; 

    removeButton.innerText = "삭제";
    removeButton.addEventListener("click", removeTodo); 
    
    li.innerText = text;
    li.appendChild(removeButton);
    li.id = newId; 

    todoList.appendChild(li);
    const todoElement = {
        text,
        id: newId,
    };

    todoArray.push(todoElement); 
    saveTodoArray(); 
}

// todo_array 에서 현재 상태 제거
function removeTodo(event) {
    const button = event.target;
    const li = button.parentNode; 
    
    todoList.removeChild(li); 
       
    const temp = todoArray.filter(function (todo) { 
        return todo.id != parseInt(li.id);
    });

    todoArray = temp; 
    saveTodoArray(); 
}

// 일정 추가 버튼 활성화
document.getElementById("addToDo_button").onclick = function () {
    const text = document.getElementById("todo_text");
    
    if(!text.value)            
        alert('내용을 입력해 주세요!');
    else {
        addTodo(text.value);
        text.value = "";
    }
}

// 엔터키로 일정 저장
document.addEventListener("keyup", function (event) {
    if(event.code == `Enter`) {
        const text = document.getElementById("todo_text");
    
        if(!text.value)            
            alert('내용을 입력해 주세요!');
        else {
            addTodo(text.value);
            text.value = "";
        }
    }
});


// 명언 생성기
const quotesUrl = "https://raw.githubusercontent.com/golbin/hubot-maxim/master/data/maxim.json";
const quoteEl = document.getElementById("quote");
let quoteJson;

// 명언 가져오기
function getQuoteJson () {
    fetch(quotesUrl)
        .then(res => res.json())
        .then(out => {
            quoteJson = out;
        });
}

// 더블 클릭 시 명언 변경
quoteEl.ondblclick = function () {
    let num = Math.floor(Math.random() * quoteJson.length);
    quoteEl.innerHTML = `<br><p class="hidden">${quoteJson[num].message}</p><br>- ${quoteJson[num].author} -`
}

// 마우스를 올릴 때 최대화
quoteEl.onmouseenter = function () {
    document.querySelector("#quote > p").classList.remove("hidden");
}

// 마우스를 내릴 때 최소화
quoteEl.onmouseleave = function () {
    document.querySelector("#quote > p").classList.add("hidden");
}



// 초기화
function init() {
    // 프로필 표시
    loadSolvedacUserData();
    // todo 리스트 불러오기
    loadTodoArray();
    // 명언 가져오기
    getQuoteJson();
}

init();