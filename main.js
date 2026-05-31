document.addEventListener('DOMContentLoaded', () => {
    const menus = [
        // Korean (한식)
        { name: "김치찌개", category: "korean", categoryName: "한식", desc: "얼큰하고 시원한 한국인의 소울푸드!" },
        { name: "된장찌개", category: "korean", categoryName: "한식", desc: "구수한 된장과 보글보글 두부의 만남." },
        { name: "제육볶음", category: "korean", categoryName: "한식", desc: "매콤달콤한 양념에 볶아낸 밥도둑 돼지고기." },
        { name: "비빔밥", category: "korean", categoryName: "한식", desc: "각종 나물과 고추장으로 비벼낸 건강 한 끼." },
        { name: "불고기", category: "korean", categoryName: "한식", desc: "달콤 짭짤한 양념이 쏙 배어든 소고기 요리." },
        { name: "삼겹살", category: "korean", categoryName: "한식", desc: "지글지글 구워 먹는 최고의 저녁 외식 메뉴." },
        { name: "닭볶음탕", category: "korean", categoryName: "한식", desc: "포슬포슬한 감자와 매콤한 닭고기의 조화." },
        { name: "보쌈", category: "korean", categoryName: "한식", desc: "야들야들한 수육과 갓 담근 겉절이의 꿀조합." },
        { name: "냉면", category: "korean", categoryName: "한식", desc: "시원한 육수 혹은 매콤한 양념의 깔끔한 선택." },
        { name: "순두부찌개", category: "korean", categoryName: "한식", desc: "부드러운 순두부와 얼큰한 국물의 환상 궁합." },

        // Japanese (일식)
        { name: "초밥", category: "japanese", categoryName: "일식", desc: "신선한 생선과 고슬고슬한 밥의 만남." },
        { name: "돈카츠", category: "japanese", categoryName: "일식", desc: "바삭바삭한 튀김옷 속 촉촉한 등심/안심." },
        { name: "라멘", category: "japanese", categoryName: "일식", desc: "진한 국물과 쫄깃한 면발이 일품인 일본식 면요리." },
        { name: "사케동", category: "japanese", categoryName: "일식", desc: "입안에서 사르르 녹는 연어 덮밥." },
        { name: "규동", category: "japanese", categoryName: "일식", desc: "짭짤한 소고기가 듬뿍 올라간 소고기 덮밥." },
        { name: "텐동", category: "japanese", categoryName: "일식", desc: "바삭한 튀김이 한가득 올라간 튀김 덮밥." },
        { name: "우동", category: "japanese", categoryName: "일식", desc: "통통한 면발과 따끈한 국물의 정석." },
        { name: "오코노미야끼", category: "japanese", categoryName: "일식", desc: "취향껏 넣은 재료와 달콤 짭짤한 소스의 조화." },

        // Chinese (중식)
        { name: "짜장면", category: "chinese", categoryName: "중식", desc: "남녀노소 누구나 좋아하는 국민 중화요리." },
        { name: "짬뽕", category: "chinese", categoryName: "중식", desc: "불맛 가득한 얼큰한 해물 국물 요리." },
        { name: "탕수육", category: "chinese", categoryName: "중식", desc: "바삭하게 튀겨 달콤한 소스를 곁들인 별미." },
        { name: "마라탕", category: "chinese", categoryName: "중식", desc: "얼얼하고 매콤한 중독성 강한 맛." },
        { name: "꿔바로우", category: "chinese", categoryName: "중식", desc: "쫀득바삭한 식감이 일품인 북경식 탕수육." },
        { name: "마파두부", category: "chinese", categoryName: "중식", desc: "매콤한 소스와 부드러운 두부의 밥도둑 조합." },
        { name: "볶음밥", category: "chinese", categoryName: "중식", desc: "고슬고슬하게 볶아낸 중식 계란 볶음밥." },

        // Western (양식)
        { name: "스테이크", category: "western", categoryName: "양식", desc: "특별한 기분을 내고 싶을 때 최고의 선택." },
        { name: "파스타", category: "western", categoryName: "양식", desc: "토마토, 크림, 오일 등 취향대로 즐기는 면요리." },
        { name: "피자", category: "western", categoryName: "양식", desc: "치즈가 듬뿍 들어간 든든한 한 끼 식사." },
        { name: "햄버거", category: "western", categoryName: "양식", desc: "육즙 가득한 패티와 신선한 채소의 만남." },
        { name: "리조또", category: "western", categoryName: "양식", desc: "부드럽고 고소한 맛의 이탈리아식 쌀 요리." },
        { name: "라자냐", category: "western", categoryName: "양식", desc: "겹겹이 쌓인 면과 소스, 치즈의 풍부한 맛." },
        { name: "샐러드", category: "western", categoryName: "양식", desc: "가벼우면서도 신선한 채소 위주의 건강식." },

        // Simple (간편식)
        { name: "떡볶이", category: "simple", categoryName: "간편식", desc: "매콤달콤한 소스와 쫄깃한 떡의 조화." },
        { name: "김밥", category: "simple", categoryName: "간편식", desc: "간편하지만 영양 가득한 한국식 롤." },
        { name: "라면", category: "simple", categoryName: "간편식", desc: "가장 빠르고 확실한 한 끼 만족." },
        { name: "샌드위치", category: "simple", categoryName: "간편식", desc: "바쁜 일상 속 간편하게 즐기는 든든함." },
        { name: "만두", category: "simple", categoryName: "간편식", desc: "쪄도, 구워도, 튀겨도 맛있는 만능 간식/식사." },
        { name: "토스트", category: "simple", categoryName: "간편식", desc: "바삭하게 구운 빵과 다양한 재료의 조화." }
    ];

    let selectedCategory = "all";

    const chips = document.querySelectorAll('.chip');
    const recommendBtn = document.getElementById('recommend-btn');
    const resultSection = document.getElementById('result-section');
    const menuCategory = document.getElementById('menu-category');
    const menuName = document.getElementById('menu-name');
    const menuDesc = document.getElementById('menu-desc');

    if (!recommendBtn || !resultSection) {
        console.error("Critical elements not found!");
        return;
    }

    // Category Selection
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            selectedCategory = chip.dataset.category;
        });
    });

    // Recommendation Logic
    recommendBtn.addEventListener('click', () => {
        // Filter menus based on category
        const filteredMenus = selectedCategory === "all" 
            ? menus 
            : menus.filter(m => m.category === selectedCategory);

        if (filteredMenus.length === 0) return;

        // Pick random
        const randomIndex = Math.floor(Math.random() * filteredMenus.length);
        const selectedMenu = filteredMenus[randomIndex];

        // UI Feedback: Disable button briefly
        recommendBtn.disabled = true;
        recommendBtn.textContent = "추천 중...";

        // Hide current result
        resultSection.classList.add('hidden');
        
        setTimeout(() => {
            // Update content
            menuCategory.textContent = selectedMenu.categoryName;
            menuName.textContent = selectedMenu.name;
            menuDesc.textContent = selectedMenu.desc;
            
            // Show result
            resultSection.classList.remove('hidden');
            
            // Re-trigger animation on the card
            const card = resultSection.querySelector('.result-card');
            if (card) {
                card.classList.remove('animate-pop');
                void card.offsetWidth; // Trigger reflow
                card.classList.add('animate-pop');
            }

            // Re-enable button
            recommendBtn.disabled = false;
            recommendBtn.textContent = "메뉴 추천받기 🎲";
        }, 400);
    });
});
