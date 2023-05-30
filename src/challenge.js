const all_tier = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ruby']
const all_subtier = ['V', "IV", 'III', 'II', 'I']
let handle = localStorage.getItem("handle");
let user_tier, user_class;

// BOJ ID 출력
document.querySelector('.name').innerHTML = `<b>${handle}</b> 님`


// Solved AC 데이터 가져오기
async function getSolvedacUserData() {
    let response = await fetch(`https://solved.ac/api/v3/user/show?handle=${handle}`, {
        method: "GET",
        headers: {
            Accept: 'application/json'
        }
    });

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

    count.innerHTML = `총 푼 문제 수 : <b class="text-primary">${data.solvedCount}</b>`;
    tier.innerHTML = `티어 : <b class="text-primary">${calculateTier}</b>`;
    maxstreak.innerHTML = `최장 스트릭 : <b class="text-primary">${data.maxStreak}일</b>`;
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
    if(difficulty <= 6) {
        let problem_url = base_url + all_difficulty[difficulty] + `!@${handle}&sort=random`;

        const response = await fetch(problem_url, problem_options);
        const data = await response.json();

        if(data.count==0) alert("해결할 수 있는 문제가 없습니다."); 
        else window.open(`${boj_url}${data.items[0].problemId}`);
    }
    // 현재 티어
    else if(difficulty==7) {
        let problem_url = base_url + all_difficulty[user_tier] + `!@${handle}&sort=random`;

        const response = await fetch(problem_url, problem_options);
        const data = await response.json();

        if(data.count==0) alert("해결할 수 있는 문제가 없습니다."); 
        else window.open(`${boj_url}${data.items[0].problemId}`);
    }
    // 현재 클래스
    else {
        let problem_url = base_url + `c/${user_class}` + `!@${handle}&sort=random`;

        const response = await fetch(problem_url, problem_options);
        const data = await response.json();

        if(data.count==0) alert("해결할 수 있는 문제가 없습니다."); 
        else window.open(`${boj_url}${data.items[0].problemId}`);
    }
}

// 카카오 SDK
let shareProblemNumber = document.getElementById("share_number").innerText;
Kakao.init('ef39bc4ea6c955f7bd3fc1e011c2cc51'); 

Kakao.Share.createDefaultButton({
    container: '#kakaotalk-sharing-btn',
    objectType: 'text',
    text:
      '테스트',
    link: {
        mobileWebUrl: 'https://www.acmicpc.net/problem/1000',
        webUrl: 'https://www.acmicpc.net/problem/1000'
    },
});


let timeFlag = 0;
let timeStart = 0;

document.getElementById("start_button").onclick = function () {
    timeFlag = 1;
    timeStart = new Date().getTime();
};


document.getElementById("end_button").onclick = function () {
    try {
        if(!timeFlag) throw new Error('Start 버튼을 먼저 누르세요!');
    
        let dis = new Date().getTime() - timeStart;

        alert(`${Math.floor(dis/360000)%60}시 ${Math.floor(dis/60000)%60}분 ${Math.floor(dis/1000)%60}초 지났습니다.`);
        timeFlag = 0;
    }
    catch (e){
        alert(e);
    }
};



loadSolvedacUserData();

