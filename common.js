/* 탭스크립트   */
function tabscritp(){
    const tabBtns = document.querySelectorAll('.mainTab button');
    const mainConts = document.querySelectorAll('.mainCont');
    tabBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            tabBtns.forEach((btn) => btn.classList.remove('active'));
            mainConts.forEach((cont) => cont.style.display = 'none');
            btn.classList.add('active');
            mainConts[index].style.display = 'block';
        });
    });
    /*  초기화면 설정 */   
    tabBtns[0].classList.add('active');
    mainConts[0].style.display = 'block';
    /* 달력 오늘날짜 기본셋팅 */
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today; 
    
    /* 모바일에서 금액입력칸 엔터나 탭키 치면 입력되게 */
    const payedInput = document.getElementById('payed');
    payedInput.addEventListener('keydown', (event) => {
        if (event.keyCode === 13 || event.keyCode === 9) { // Enter 키(13) 또는 Tab 키(9)
            event.preventDefault(); // 기본 동작 방지
            
            const addBtn = document.querySelector('#formAdd');
            addBtn.click();

        }
    });
    
    totalAmount();

}   
/* 데이터 저장 로컬스코리지에    */
function saveData(){
    /*  */
    
    /* 필수입력값 method date payed */
    const addBtn = document.querySelector('#formAdd');
    addBtn.addEventListener('click', () => {
        const method = document.getElementById('method').value;
        const payed = document.getElementById('payed').value;
        let cate = document.getElementById('cate').value;
        let tag = document.getElementById('tag').value;
        const date = document.getElementById('date').value;
        const content = document.getElementById('content').value;
        const methodSelect = document.getElementById('method');
        
        if (!content || !date || !payed) {
            document.getElementById('errmentBox').textContent = '결제수단, 날짜, 금액은 필수 입력값입니다.';

            return;
        }

        /* 태그 카테고리 값이 없으면 content 값으로 채우기 */
        if (!tag) {
            tag = content;
        }
        if (!cate) {
            cate = content;
        }
        document.getElementById('errmentBox').textContent = '';



        const entry = {
            payed: payed,
            cate: cate,
            tag: tag,
            id: 'id-' + Math.random().toString(36).substr(2, 9),
            date: date,
            method: method,
            content: content
        };
        let entries = JSON.parse(localStorage.getItem('entries')) || [];
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));
        renderTable();
    });

    const editBtn = document.querySelectorAll('.editBtn');
    
    editBtn.forEach(button => {
        button.addEventListener('click', () => {
            const id = document.querySelector('.form').getAttribute('data-id');
            const method = document.getElementById('method').value;
            const payed = document.getElementById('payed').value;
            let cate = document.getElementById('cate').value;
            let tag = document.getElementById('tag').value;
            const date = document.getElementById('date').value;
            const content = document.getElementById('content').value;
            if (!content || !date || !payed) {
                document.getElementById('errmentBox').textContent = '결제수단, 날짜, 금액은 필수 입력값입니다.';
                return;
            }
            /* 태그 카테고리 값이 없으면 content 값으로 채우기 */
            if (!tag) {
                tag = content;
            }
            if (!cate) {
                cate = content;
            }
            document.getElementById('errmentBox').textContent = '';
            /* 태그, 카테고리는 , 구분자로 분리 */
            tag = tag.split(',').map(item => item.trim());
            cate = cate.split(',').map(item => item.trim());

            let entries = JSON.parse(localStorage.getItem('entries')) || [];
            const entryIndex = entries.findIndex(e => e.id === id);
            if (entryIndex !== -1) {
                entries[entryIndex] = {
                    id: id,
                    method: method,
                    payed: payed,
                    cate: cate,
                    tag: tag,
                    date: date,
                    content: content
                };
                localStorage.setItem('entries', JSON.stringify(entries));
                renderTable();
            }
            /* 수정후 추가버튼 보이게하고 수정버튼 숨기기 */
            document.querySelector('#formAdd').style.display = 'inline-block';
            document.querySelector('#formEdit').style.display = 'none';

            
            const dataControl = document.querySelector('.dataControl');
            dataControl.style.display = 'none';
        });
    });

    /* 데이터 추가하고  초기화 */
    document.getElementById('payed').value = '';
    document.getElementById('cate').value = '';
    document.getElementById('tag').value = '';
    document.getElementById('method').value = 'MG';
    document.getElementById('content').value = '';
    document.getElementById('date').value = new Date().toISOString().split('T')[0];

    totalAmount();
}

/* 총액 구하기 */
function totalAmount(){
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    let total = 0;
    entries.forEach(entry => {
        total += parseFloat(entry.payed);
    });
    document.getElementById('totalAmount').textContent = total.toLocaleString();

    recommendBox()
}


/* 테이블 tr 클릭하면 삭제,수정 할수있게 레이어팝업 띄어줌 */
function tableRowClick(){
    const tableBody = document.getElementById('dataList');
    tableBody.addEventListener('click', (event) => {
        const targetRow = event.target.closest('tr');
        if (!targetRow) return; // 클릭한 곳이 tr이 아니면 무시
        const rowIndex = Array.from(tableBody.children).indexOf(targetRow);
        let entries = JSON.parse(localStorage.getItem('entries')) || [];
        const entry = entries[rowIndex];
        // 수정, 삭제 기능 구현 필요

        /* 레이어 팝업  */
        const dataControl = document.querySelector('.dataControl');
        dataControl.style.display = 'block';

        /* 클릭한 행에 강조 표시 추가 */
        const allRows = tableBody.querySelectorAll('tr');
        allRows.forEach(row => row.classList.remove('on'));
        targetRow.classList.add('on');

        /*  tr 클릭하면 수정 할수있게 셋팅   */
        const form = document.querySelector('.form');
        form.setAttribute('data-id', entry.id);
        document.getElementById('method').value = entry.method;
        document.getElementById('payed').value = entry.payed;
        document.getElementById('cate').value = entry.cate;
        document.getElementById('tag').value = entry.tag;
        document.getElementById('date').value = entry.date;
        document.getElementById('content').value = entry.content;
        document.querySelector('#formEdit').style.display = 'inline-block';

    });
}

function dataControlLayerPopUp(){


    /* 삭제 버튼 클릭시 현재 아이디 찾아서 삭제  */
    const deleteBtn = document.querySelector('#deleteBtn');
    deleteBtn.addEventListener('click', () => {
        
        /* 클릭한 행의 데이터 가져오기 */
        const tableBody = document.getElementById('dataList');
        const activeRow = tableBody.querySelector('tr.on');
        if (!activeRow) return;
        const rowId = activeRow.getAttribute('data-id');
        let entries = JSON.parse(localStorage.getItem('entries')) || [];
        const entry = entries.find(e => e.id === rowId);
        /* 아이디로 로컬스토리지에서 삭제 */
        entries = entries.filter(e => e.id !== rowId);
        localStorage.setItem('entries', JSON.stringify(entries));
        
        

        renderTable();
        dataControl.style.display = 'none';
    });
    
}





/* 표에 내용 뿌리기 */
function renderTable(){
    /* 이전달 13일부터 현재달 12일까지 1달기준으로함 */
    /* 12일이 지났으면 현재달 13일부터 */
    const now = new Date();
    let startDate, endDate;
    if (now.getDate() >= 13) {
        startDate = new Date(now.getFullYear(), now.getMonth(), 13);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 12);
    } else {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 13);
        endDate = new Date(now.getFullYear(), now.getMonth(), 12);
    }
   
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    console.log(entries)
    const tableBody = document.getElementById('dataList');
    tableBody.innerHTML = '';
    /* 날짜가 startDate와 endDate사이에 있는 데이터만 뿌리기 */
    /* 돈에 콤마 추가 */
    /* 날짜는 월일만 */
    function formatNumberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function formatDateToMonthDay(dateString) {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}월 ${day}일`;
    }
    entries.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate >= startDate && entryDate <= endDate) {
            const row = document.createElement('tr');
            row.setAttribute('data-id', entry.id);
            let tag = entry.tag;
            if (Array.isArray(entry.tag)) {
                tag = entry.tag.join(', ');
            }
            let cate = entry.cate;
            if (Array.isArray(entry.cate)) {
                cate = entry.cate.join(', ');
            }

            
            row.innerHTML = `
                <td>${formatDateToMonthDay(entry.date)}</td>
                <td>${entry.content}</td>
                <td>${entry.method}</td>
                <td>${cate}</td>
                <td>${formatNumberWithCommas(entry.payed)}</td>
                <td>${tag}</td>
            `;
            tableBody.appendChild(row);
        }
    });
    totalAmount();
    renderChart();
    tableRowClick();
}




/* 데이터 삭제   */
function deleteData(){
    const deleteBtn = document.querySelector('.deleteAllBtn');
    deleteBtn.addEventListener('click', () => {
        localStorage.removeItem('entries');
        renderTable();
    });
}
/* 차트는 바 차트로 결제 수단, 카테고리별로 보여줌 */
let selectedType = 'method';
function renderChart(){
    /* 로컬스토리지에서 데이터 가져오기 */
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    
    /* 차트 셀렉트박스가 변경되면 값에 따라 차트 보여주기 */
    const chartTypeSelect = document.querySelector('.chartBox select');
    let labels = [];
    let data = []; 
    let dataMap = {};
    entries.forEach(entry => {
        let key;
        if (selectedType === 'method') {
            key = entry.method;
        }
        else if (selectedType === 'cate') {
            key = entry.cate;
        }
        else if (selectedType === 'tag') {
            key = entry.tag;
        }  
        if (dataMap[key]) {
            dataMap[key] += parseFloat(entry.payed);
        } else {
            dataMap[key] = parseFloat(entry.payed);
        }
    });
    labels = Object.keys(dataMap);
    data = Object.values(dataMap);

    /* 차트 그리기 */
    // 기존 차트가 있으면 삭제
    const existingChart = Chart.getChart("myChart");
    if (existingChart) {
        existingChart.destroy();
    }
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '금액',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        }
    });

    totalAmount();
}

/* 주별 월별 통계 데이터 차트 그리기 */
function renderWeeklyMonthlyChart(){
    /* 셀렉트 박스 값 가져오기 */
    const sortPeriodT = document.getElementById('sortPeriodT').value;
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    let labels = [];
    let data = []; 
    let dataMap = {};
    entries.forEach(entry => {
        let key;
        const entryDate = new Date(entry.date);
        if (sortPeriodT === 'weekT') {
            const firstDayOfYear = new Date(entryDate.getFullYear(), 0, 1);
            const pastDaysOfYear = (entryDate - firstDayOfYear) / 86400000;
            const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
            key = `${entryDate.getFullYear()}-W${weekNumber}`;
        } else if (sortPeriodT === 'monthT') {
            key = `${entryDate.getFullYear()}-${entryDate.getMonth() + 1}`;
        }
        if (dataMap[key]) {
            dataMap[key] += parseFloat(entry.payed);
        } else {
            dataMap[key] = parseFloat(entry.payed);
        }
    });
    labels = Object.keys(dataMap);
    data = Object.values(dataMap);
    /*  주별 타이틀은 0주전, -1주전 등으로 표시 년도는 삭제 */
    if (sortPeriodT === 'weekT') {
        const currentDate = new Date();
        labels = labels.map(label => {
            const [year, weekStr] = label.split('-W');
            const weekNumber = parseInt(weekStr);
            const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
            const pastDaysOfYear = (currentDate - firstDayOfYear) / 86400000;
            const currentWeekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
            const weeksAgo = currentWeekNumber - weekNumber;
            return `${weeksAgo}주전`;
        });
        labels.reverse();
    } else if (sortPeriodT === 'monthT') {
        /* 월별 타이틀은 1월, 2월 등으로 표시 년도는 삭제 */
        /* 최신월이 오른쪽에 */
        labels = labels.map(label => {
            const [year, monthStr] = label.split('-');
            return `${parseInt(monthStr)}월`;
        });
        labels.reverse();
    }
    
    // 차트 그리기
    // 기존 차트가 있으면 삭제
    const existingChart2 = Chart.getChart("myChart2");
    if (existingChart2) {
        existingChart2.destroy();
    }
    const ctx2 = document.getElementById('myChart2').getContext('2d');
    new Chart(ctx2, {
        type: 'line', // 예시로 선형 차트 사용
        data: {
            labels: labels, // 주별 또는 월별 라벨
            datasets: [{
                label: '금액',
                data: data, // 집계된 금액 데이터
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',  
                borderWidth: 1
            }]
        }
    });

}



/* recommendBox 내용 추천 */
function recommendBox(){
    /* 결제수단 카테고리 태그 각각 5개씩 최근데이터 기준으로 뿌리기 */
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    const methodSet = new Set();
    const cateSet = new Set();
    const tagSet = new Set();
    const contentSet = new Set();
    /* 최근데이터 기준으로 5개씩 뽑기 */
    for (let i = entries.length - 1; i >= 0; i--) {
        const entry = entries[i];
        
        if (methodSet.size < 10) {
            methodSet.add(entry.method);
        }
        if (contentSet.size < 10) {
            contentSet.add(entry.content);
        }
        
        /*  태그와 카테고리의 내용은 contentSet과 중복 안되는것만 가져오기 */
        if (cateSet.size < 10 && !contentSet.has(entry.cate)) {
            cateSet.add(entry.cate);
        }
        if (tagSet.size < 10 && !contentSet.has(entry.tag)) {
            tagSet.add(entry.tag);
        }

        if (methodSet.size >= 10 && cateSet.size >= 10 && tagSet.size >= 10 && contentSet.size >= 10) {
            break;
        }
    }
    /* 각각 박스에 뿌리기 */
    const methodBox = document.getElementById('cardList');   
    const cateBox = document.getElementById('cateList');
    const tagBox = document.getElementById('tagList');
    const contentBox = document.getElementById('contentList');
    methodBox.innerHTML = '';
    cateBox.innerHTML = '';
    tagBox.innerHTML = '';  
    contentBox.innerHTML = '';
    
    

    /* 추천태크를 뿌리고 클릭하면 인풋에 자동으로 추가되게   */
    methodSet.forEach(method => {
        const span = document.createElement('span');
        span.textContent = method;
        span.addEventListener('click', () => {
            document.getElementById('').value = method;
        });
        methodBox.appendChild(span);
    });
    cateSet.forEach(cate => {
        const span = document.createElement('span');
        span.textContent = cate;
        span.addEventListener('click', () => {
            document.getElementById('cate').value = cate;
        });
        cateBox.appendChild(span);
    });
    tagSet.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag;
        span.addEventListener('click', () => {
            document.getElementById('tag').value = tag;
        });
        tagBox.appendChild(span);
    });
    contentSet.forEach(content => {
        const span = document.createElement('span');
        span.textContent = content;
        span.addEventListener('click', () => {
            document.getElementById('content').value = content;
        });
        contentBox.appendChild(span);
    });








}



loadData = function() {
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    /* 기존데이터에 아이디 컬럽 있는지 체크해서 없으면 아이디 부여, 랜덤 문자&숫자 */
    let updated = false;
    entries.forEach((entry, index) => {
        if (!entry.id) {
            entry.id = 'id-' + Math.random().toString(36).substr(2, 9);
            updated = true;
        }
    });
    if (updated) {
        localStorage.setItem('entries', JSON.stringify(entries));
    }
    return entries;
}



/* 윈도우 로드이벤트 */

$(window).on('load', function() {
    loadData()

    tabscritp(); // 탭스크립트
    saveData(); //데이터저장
    renderTable(); //데이터표에 뿌리기
    deleteData(); //데이터삭제
    const chartTypeSelect = document.querySelector('.chartBox select');
    renderChart(); //차트그리기
    
    recommendBox(); //추천박스내용뿌리기

    // 차트 버튼 이벤트 처리
    const chartBoxBtn = document.querySelector('#chartBoxBtn');
    chartBoxBtn.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            // 선택된 값에 따라 차트 다시 그리기
            selectedType = event.target.value;
            renderChart();
            // 버튼 상태 변경
            const buttons = chartBoxBtn.querySelectorAll('button');
            buttons.forEach(button => {
                button.classList.remove('on');
            });
            console.log(event.target);
            event.target.classList.add('on');
        } 
    });
    renderWeeklyMonthlyChart(); // 주별 월별 차트 그리기
    const sortPeriodTSelect = document.getElementById('sortPeriodT');
    sortPeriodTSelect.addEventListener('change', () => {
        renderWeeklyMonthlyChart();
    });

    
    dataControlLayerPopUp(); //데이터컨트롤 레이어팝업

});