// Quiz App 主要 JavaScript 文件

// 全局变量 - 测验设置
const quizSettings = {
    amount: 1,
    category: '',
    difficulty: 'medium'
};

// 测验状态
const quizState = {
    questions: [],
    currentQuestionIndex: 0,
    correctAnswers: 0,
    userAnswers: [],
    isAnswered: false,
    startTime: null,
    endTime: null
};

// DOM 元素
const welcomeCard = document.getElementById('welcomeCard');
const amountCard = document.getElementById('amountCard');
const categoryCard = document.getElementById('categoryCard');
const difficultyCard = document.getElementById('difficultyCard');
const quizCard = document.getElementById('quizCard');
const summaryCard = document.getElementById('summaryCard');

const startBtn = document.getElementById('startBtn');
const amountInput = document.getElementById('amountInput');
const decreaseBtn = document.getElementById('decreaseBtn');
const increaseBtn = document.getElementById('increaseBtn');
const amountBackBtn = document.getElementById('amountBackBtn');
const amountNextBtn = document.getElementById('amountNextBtn');
const categorySelect = document.getElementById('categorySelect');
const categoryBackBtn = document.getElementById('categoryBackBtn');
const categoryNextBtn = document.getElementById('categoryNextBtn');
const difficultyBackBtn = document.getElementById('difficultyBackBtn');
const startQuizBtn = document.getElementById('startQuizBtn');

// 测验相关 DOM 元素
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const viewSummaryBtn = document.getElementById('viewSummaryBtn');

// 总结相关 DOM 元素
const restartQuizBtn = document.getElementById('restartQuizBtn');

// 加载模态框 DOM 元素
const loadingModal = document.getElementById('loadingModal');

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    console.log('Quiz App 已加载');
    
    // 添加事件监听器
    initEventListeners();
    
    // 初始化选项按钮事件
    initOptionButtons();
    
    // 初始化数量输入框
    initAmountInput();
    
    // 初始化类别下拉框
    initCategorySelect();
    
    // 立即加载类别数据
    loadCategories();
});

// 初始化事件监听器
function initEventListeners() {
    if (startBtn) startBtn.addEventListener('click', () => showCard('amount'));
    if (decreaseBtn) decreaseBtn.addEventListener('click', decreaseAmount);
    if (increaseBtn) increaseBtn.addEventListener('click', increaseAmount);
    if (amountBackBtn) amountBackBtn.addEventListener('click', () => showCard('welcome'));
    if (amountNextBtn) amountNextBtn.addEventListener('click', () => showCard('category'));
    if (categoryBackBtn) categoryBackBtn.addEventListener('click', () => showCard('amount'));
    if (categoryNextBtn) categoryNextBtn.addEventListener('click', () => showCard('difficulty'));
    if (difficultyBackBtn) difficultyBackBtn.addEventListener('click', () => showCard('category'));
    if (startQuizBtn) startQuizBtn.addEventListener('click', handleStartQuiz);
    if (nextQuestionBtn) nextQuestionBtn.addEventListener('click', nextQuestion);
    if (viewSummaryBtn) viewSummaryBtn.addEventListener('click', showSummary);
    if (restartQuizBtn) restartQuizBtn.addEventListener('click', restartQuiz);
}

// 初始化选项按钮
function initOptionButtons() {
    // 为所有选项按钮添加点击事件
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除同组其他按钮的 active 类
            const parent = this.parentElement;
            parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
            
            // 为当前按钮添加 active 类
            this.classList.add('active');
            
            // 更新设置值
            const cardId = this.closest('.card').id;
            const value = this.dataset.value;
            
            switch(cardId) {
                case 'difficultyCard':
                    quizSettings.difficulty = value;
                    break;
            }
            
            console.log('设置更新:', quizSettings);
        });
    });
}

// 显示指定卡片
function showCard(cardType) {
    // 隐藏所有卡片
    const allCards = [welcomeCard, amountCard, categoryCard, difficultyCard, quizCard, summaryCard];
    allCards.forEach(card => {
        if (card) {
            card.classList.add('fade-out');
            setTimeout(() => {
                card.classList.add('hidden');
                card.classList.remove('fade-out');
            }, 300);
        }
    });
    
    // 显示目标卡片
    let targetCard;
    switch(cardType) {
        case 'welcome':
            targetCard = welcomeCard;
            break;
        case 'amount':
            targetCard = amountCard;
            break;
        case 'category':
            targetCard = categoryCard;
            break;
        case 'difficulty':
            targetCard = difficultyCard;
            break;
        case 'quiz':
            targetCard = quizCard;
            break;
        case 'summary':
            targetCard = summaryCard;
            break;
    }
    
    if (targetCard) {
        setTimeout(() => {
            targetCard.classList.remove('hidden');
            targetCard.classList.add('fade-in');
            setTimeout(() => {
                targetCard.classList.remove('fade-in');
            }, 300);
        }, 300);
    }
}

// 处理开始测验
async function handleStartQuiz() {
    console.log('开始测验！设置:', quizSettings);
    
    // 显示加载模态框
    showLoadingModal();
    
    // 构建 API URL
    let apiUrl = `https://opentdb.com/api.php?amount=${quizSettings.amount}`;
    
    if (quizSettings.category) {
        apiUrl += `&category=${quizSettings.category}`;
    }
    
    if (quizSettings.difficulty) {
        apiUrl += `&difficulty=${quizSettings.difficulty}`;
    }
    
    console.log('API URL:', apiUrl);
    
    try {
        // 调用 API 获取测验数据
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.response_code === 0 && data.results && data.results.length > 0) {
            // 初始化测验状态
            initQuizState(data.results);
            
            // 隐藏加载模态框
            hideLoadingModal();
            
            // 显示测验卡片
            showCard('quiz');
            
            // 显示第一题
            displayCurrentQuestion();
        } else {
            console.error('API 错误或无数据:', data);
            hideLoadingModal();
            alert('获取测验数据失败，请稍后重试。');
        }
    } catch (error) {
        console.error('获取测验数据失败:', error);
        hideLoadingModal();
        alert('网络错误，请检查网络连接后重试。');
    }
}

// 初始化数量输入框
function initAmountInput() {
    if (!amountInput) return;
    
    // 输入框变化事件
    amountInput.addEventListener('input', handleAmountInput);
    amountInput.addEventListener('change', handleAmountInput);
    
    // 支持键盘上下箭头
    amountInput.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            increaseAmount();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            decreaseAmount();
        }
    });
    
    // 支持鼠标滚轮
    amountInput.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (e.deltaY < 0) {
            increaseAmount();
        } else {
            decreaseAmount();
        }
    });
}

// 处理数量输入
function handleAmountInput() {
    let value = amountInput.value;
    
    // 处理空值
    if (value === '' || value === null) {
        value = 1;
    }
    
    // 转换为数字并向下取整
    value = Math.floor(parseFloat(value));
    
    // 处理 NaN
    if (isNaN(value)) {
        value = 1;
    }
    
    // 使用模运算处理超出范围的数字
    if (value < 1) {
        value = 1;
    } else if (value > 50) {
        // 当超过50时，使用模运算循环到1-50范围
        value = ((value - 1) % 50) + 1;
    }
    
    // 更新输入框和设置
    amountInput.value = value;
    quizSettings.amount = value;
    
    console.log('题目数量更新:', value);
}

// 减少数量
function decreaseAmount() {
    let currentValue = parseInt(amountInput.value) || 1;
    let newValue = currentValue - 1;
    
    // 如果小于1，循环到50
    if (newValue < 1) {
        newValue = 50;
    }
    
    amountInput.value = newValue;
    handleAmountInput();
}

// 增加数量
function increaseAmount() {
    let currentValue = parseInt(amountInput.value) || 1;
    let newValue = currentValue + 1;
    
    // 如果大于50，循环到1
    if (newValue > 50) {
        newValue = 1;
    }
    
    amountInput.value = newValue;
    handleAmountInput();
}

// 初始化类别下拉框
function initCategorySelect() {
    if (!categorySelect) return;
    
    // 下拉框变化事件
    categorySelect.addEventListener('change', handleCategoryChange);
}

// 处理类别选择变化
function handleCategoryChange() {
    const selectedValue = categorySelect.value;
    const selectedText = categorySelect.options[categorySelect.selectedIndex].text;
    
    // 更新设置
    quizSettings.category = selectedValue;
    
    // 更新显示文本
    updateCategoryDisplay();
    
    console.log('类别更新:', selectedValue, selectedText);
}

// 更新类别显示文本
function updateCategoryDisplay() {
    const selectedCategoryText = document.querySelector('.selected-category-text');
    if (selectedCategoryText && categorySelect) {
        const selectedText = categorySelect.options[categorySelect.selectedIndex].text;
        selectedCategoryText.textContent = `当前选择：${selectedText}`;
    }
}

// 加载类别数据
async function loadCategories() {
    try {
        // 显示加载状态
        categorySelect.innerHTML = '<option value="">Loading categories...</option>';
        categorySelect.disabled = true;
        
        // 调用 API 获取类别数据
        const response = await fetch('https://opentdb.com/api_category.php');
        const data = await response.json();
        
        if (data.trivia_categories && Array.isArray(data.trivia_categories)) {
            // 清空现有选项
            categorySelect.innerHTML = '';
            
            // 添加默认选项
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Any Category';
            categorySelect.appendChild(defaultOption);
            
            // 添加 API 返回的类别选项
            data.trivia_categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
            
            console.log('类别数据加载成功:', data.trivia_categories.length, '个类别');
        } else {
            throw new Error('Invalid API response format');
        }
        
        // 启用下拉框
        categorySelect.disabled = false;
        
        // 初始化显示
        updateCategoryDisplay();
        
    } catch (error) {
        console.error('加载类别数据失败:', error);
        
        // 显示错误状态并提供备用选项
        categorySelect.innerHTML = `
            <option value="">Any Category</option>
            <option value="9">General Knowledge</option>
            <option value="17">Science & Nature</option>
            <option value="18">Science: Computers</option>
            <option value="21">Sports</option>
            <option value="22">Geography</option>
            <option value="23">History</option>
        `;
        
        categorySelect.disabled = false;
        updateCategoryDisplay();
        
        // 可选：显示错误提示给用户
        const selectedCategoryText = document.querySelector('.selected-category-text');
        if (selectedCategoryText) {
            selectedCategoryText.textContent = '网络错误，显示基础类别';
            selectedCategoryText.style.color = '#ff6b6b';
            setTimeout(() => {
                selectedCategoryText.style.color = '';
                updateCategoryDisplay();
            }, 3000);
        }
    }
}

// 初始化测验状态
function initQuizState(questions) {
    // 解码 HTML 实体
    const decodedQuestions = questions.map(question => ({
        ...question,
        question: decodeHTML(question.question),
        correct_answer: decodeHTML(question.correct_answer),
        incorrect_answers: question.incorrect_answers.map(answer => decodeHTML(answer))
    }));
    
    quizState.questions = decodedQuestions;
    quizState.currentQuestionIndex = 0;
    quizState.correctAnswers = 0;
    quizState.userAnswers = [];
    quizState.isAnswered = false;
    quizState.startTime = new Date();
    quizState.endTime = null;
    
    console.log('测验初始化完成，题目数量:', decodedQuestions.length);
}

// HTML 解码函数
function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

// 显示当前问题
function displayCurrentQuestion() {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    if (!currentQuestion) return;
    
    // 更新进度信息
    updateProgressInfo();
    
    // 更新问题内容
    const questionElement = document.getElementById('quizQuestion');
    const categoryElement = document.getElementById('quizCategory');
    const difficultyBadge = document.getElementById('difficultyBadge');
    
    if (questionElement) questionElement.textContent = currentQuestion.question;
    if (categoryElement) categoryElement.textContent = currentQuestion.category;
    if (difficultyBadge) {
        difficultyBadge.textContent = currentQuestion.difficulty;
        difficultyBadge.setAttribute('data-difficulty', currentQuestion.difficulty);
    }
    
    // 生成答案选项
    generateAnswerOptions(currentQuestion);
    
    // 重置状态
    quizState.isAnswered = false;
    hideQuizFeedback();
    hideButtons();
}

// 更新进度信息
function updateProgressInfo() {
    const currentQuestionElement = document.getElementById('currentQuestion');
    const totalQuestionsElement = document.getElementById('totalQuestions');
    const accuracyRateElement = document.getElementById('accuracyRate');
    
    if (currentQuestionElement) {
        currentQuestionElement.textContent = quizState.currentQuestionIndex + 1;
    }
    
    if (totalQuestionsElement) {
        totalQuestionsElement.textContent = quizState.questions.length;
    }
    
    if (accuracyRateElement) {
        if (quizState.currentQuestionIndex === 0 && quizState.userAnswers.length === 0) {
            accuracyRateElement.textContent = '-';
        } else {
            const answeredQuestions = quizState.userAnswers.length;
            if (answeredQuestions > 0) {
                const accuracy = ((quizState.correctAnswers / answeredQuestions) * 100).toFixed(1);
                accuracyRateElement.textContent = `${accuracy}%`;
            }
        }
    }
}

// 生成答案选项
function generateAnswerOptions(question) {
    const answersContainer = document.getElementById('answersContainer');
    if (!answersContainer) return;
    
    // 混合正确答案和错误答案
    const allAnswers = [...question.incorrect_answers, question.correct_answer];
    
    // 随机打乱答案顺序
    const shuffledAnswers = shuffleArray(allAnswers);
    
    // 清空现有选项
    answersContainer.innerHTML = '';
    
    // 生成选项按钮
    shuffledAnswers.forEach((answer, index) => {
        const answerButton = document.createElement('button');
        answerButton.className = 'answer-option';
        answerButton.setAttribute('data-answer', answer);
        
        answerButton.innerHTML = `
            <span class="answer-label">${String.fromCharCode(65 + index)}</span>
            <span class="answer-text">${answer}</span>
        `;
        
        answerButton.addEventListener('click', () => handleAnswerClick(answerButton, answer, question.correct_answer));
        
        answersContainer.appendChild(answerButton);
    });
}

// 随机打乱数组
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 处理答案点击
function handleAnswerClick(clickedButton, selectedAnswer, correctAnswer) {
    if (quizState.isAnswered) return;
    
    quizState.isAnswered = true;
    const isCorrect = selectedAnswer === correctAnswer;
    
    // 记录用户答案
    quizState.userAnswers.push({
        question: quizState.questions[quizState.currentQuestionIndex].question,
        selectedAnswer,
        correctAnswer,
        isCorrect
    });
    
    if (isCorrect) {
        quizState.correctAnswers++;
    }
    
    // 禁用所有选项并显示结果
    const allOptions = document.querySelectorAll('.answer-option');
    allOptions.forEach(option => {
        option.classList.add('disabled');
        const answer = option.getAttribute('data-answer');
        
        if (answer === correctAnswer) {
            option.classList.add('correct');
        } else if (option === clickedButton && !isCorrect) {
            option.classList.add('incorrect');
        }
    });
    
    // 显示反馈
    showQuizFeedback(isCorrect, correctAnswer);
    
    // 更新进度信息
    updateProgressInfo();
    
    // 显示下一题按钮（无论对错都显示）
    showNextButton();
}

// 显示测验反馈
function showQuizFeedback(isCorrect, correctAnswer) {
    const feedbackElement = document.getElementById('quizFeedback');
    const feedbackResult = document.getElementById('feedbackResult');
    const correctAnswerDisplay = document.getElementById('correctAnswerDisplay');
    const correctAnswerText = document.getElementById('correctAnswerText');
    
    if (!feedbackElement || !feedbackResult) return;
    
    // 设置反馈结果
    feedbackResult.className = `feedback-result ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackResult.innerHTML = `
        <span class="result-icon">${isCorrect ? '✅' : '❌'}</span>
        <span class="result-text">${isCorrect ? '正确！' : '答错了'}</span>
    `;
    
    // 如果答错，显示正确答案
    if (!isCorrect && correctAnswerDisplay && correctAnswerText) {
        correctAnswerDisplay.classList.remove('hidden');
        correctAnswerText.textContent = correctAnswer;
    } else if (correctAnswerDisplay) {
        correctAnswerDisplay.classList.add('hidden');
    }
    
    // 显示反馈区域
    feedbackElement.classList.remove('hidden');
}

// 隐藏测验反馈
function hideQuizFeedback() {
    const feedbackElement = document.getElementById('quizFeedback');
    if (feedbackElement) {
        feedbackElement.classList.add('hidden');
    }
}

// 显示下一题按钮
function showNextButton() {
    if (nextQuestionBtn) {
        nextQuestionBtn.classList.remove('hidden');
    }
}

// 隐藏按钮
function hideButtons() {
    if (nextQuestionBtn) nextQuestionBtn.classList.add('hidden');
    if (viewSummaryBtn) viewSummaryBtn.classList.add('hidden');
}

// 下一题
function nextQuestion() {
    quizState.currentQuestionIndex++;
    
    if (quizState.currentQuestionIndex < quizState.questions.length) {
        // 还有题目，显示下一题
        displayCurrentQuestion();
    } else {
        // 所有题目完成，显示总结按钮
        showCompletionMessage();
    }
}

// 显示完成消息
function showCompletionMessage() {
    const feedbackElement = document.getElementById('quizFeedback');
    const feedbackResult = document.getElementById('feedbackResult');
    const correctAnswerDisplay = document.getElementById('correctAnswerDisplay');
    
    if (feedbackElement && feedbackResult) {
        const accuracy = ((quizState.correctAnswers / quizState.questions.length) * 100).toFixed(1);
        
        feedbackResult.className = 'feedback-result correct';
        feedbackResult.innerHTML = `
            <span class="result-icon">🎉</span>
            <span class="result-text">测验完成！</span>
        `;
        
        if (correctAnswerDisplay) {
            correctAnswerDisplay.classList.remove('hidden');
            correctAnswerDisplay.innerHTML = `
                <p class="correct-answer-label">最终成绩：</p>
                <p class="correct-answer-text">${quizState.correctAnswers}/${quizState.questions.length} (${accuracy}%)</p>
            `;
        }
        
        feedbackElement.classList.remove('hidden');
    }
    
    // 显示查看总结按钮
    if (viewSummaryBtn) {
        viewSummaryBtn.classList.remove('hidden');
    }
    
    console.log('测验完成！正确率:', quizState.correctAnswers, '/', quizState.questions.length);
}

// 显示总结页面
function showSummary() {
    // 记录结束时间
    quizState.endTime = new Date();
    
    // 生成总结数据
    generateSummaryData();
    
    // 显示总结卡片
    showCard('summary');
}

// 生成总结数据
function generateSummaryData() {
    const totalQuestions = quizState.questions.length;
    const correctAnswers = quizState.correctAnswers;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(1);
    
    // 计算用时
    const duration = quizState.endTime - quizState.startTime;
    const durationText = formatDuration(duration);
    const averageTime = Math.round(duration / totalQuestions / 1000);
    
    // 更新基本统计信息
    updateElement('finalScorePercent', `${accuracy}%`);
    updateElement('correctCount', correctAnswers);
    updateElement('incorrectCount', incorrectAnswers);
    updateElement('totalCount', totalQuestions);
    updateElement('quizDuration', durationText);
    updateElement('averageTime', `${averageTime}秒/题`);
    updateElement('accuracyPercent', `${accuracy}%`);
    
    // 更新类别信息
    const categoryInfo = getCategoryDisplayText();
    updateElement('summaryCategoryInfo', categoryInfo);
    
    // 生成表现评价
    generateEvaluation(accuracy);
    
    // 生成详细回顾
    generateDetailedReview();
}

// 格式化时长
function formatDuration(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (minutes > 0) {
        return `${minutes}分${seconds}秒`;
    } else {
        return `${seconds}秒`;
    }
}

// 更新元素内容
function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = content;
    }
}

// 获取类别显示文本
function getCategoryDisplayText() {
    const categoryName = quizState.questions[0]?.category || 'Mixed';
    const difficulty = quizState.questions[0]?.difficulty || 'Mixed';
    return `${categoryName} · ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
}

// 生成表现评价
function generateEvaluation(accuracy) {
    const evaluationBadge = document.getElementById('evaluationBadge');
    const evaluationDescription = document.getElementById('evaluationDescription');
    
    if (!evaluationBadge || !evaluationDescription) return;
    
    let icon, text, description, badgeClass;
    
    if (accuracy >= 90) {
        icon = '🏆';
        text = '表现卓越！';
        description = '您展现了出色的知识水平，几乎完美地回答了所有问题！';
        badgeClass = 'excellent';
    } else if (accuracy >= 80) {
        icon = '🎉';
        text = '表现优秀！';
        description = '您在这个领域有着扎实的基础知识，继续保持！';
        badgeClass = 'good';
    } else if (accuracy >= 70) {
        icon = '👍';
        text = '表现良好！';
        description = '您掌握了大部分知识点，稍加练习就能更进一步！';
        badgeClass = 'fair';
    } else if (accuracy >= 60) {
        icon = '💪';
        text = '继续努力！';
        description = '您已经掌握了基础知识，多加练习就能显著提升！';
        badgeClass = 'needs-improvement';
    } else {
        icon = '📚';
        text = '需要加强！';
        description = '建议您多学习相关知识，相信下次会有更好的表现！';
        badgeClass = 'poor';
    }
    
    evaluationBadge.innerHTML = `
        <span class="evaluation-icon">${icon}</span>
        <span class="evaluation-text">${text}</span>
    `;
    evaluationBadge.className = `evaluation-badge ${badgeClass}`;
    evaluationDescription.textContent = description;
}

// 生成详细回顾
function generateDetailedReview() {
    const reviewList = document.getElementById('reviewList');
    if (!reviewList) return;
    
    reviewList.innerHTML = '';
    
    quizState.userAnswers.forEach((userAnswer, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.className = `review-item ${userAnswer.isCorrect ? 'correct' : 'incorrect'}`;
        
        const icon = userAnswer.isCorrect ? '✅' : '❌';
        
        reviewItem.innerHTML = `
            <div class="review-icon">${icon}</div>
            <div class="review-content">
                <div class="review-question">${index + 1}. ${userAnswer.question}</div>
                <div class="review-answer">
                    <div class="review-answer-item user-answer">您的答案: ${userAnswer.selectedAnswer}</div>
                    ${!userAnswer.isCorrect ? `<div class="review-answer-item correct-answer">正确答案: ${userAnswer.correctAnswer}</div>` : ''}
                </div>
            </div>
        `;
        
        reviewList.appendChild(reviewItem);
    });
}

// 重新开始测验
function restartQuiz() {
    // 重置所有状态
    quizState.questions = [];
    quizState.currentQuestionIndex = 0;
    quizState.correctAnswers = 0;
    quizState.userAnswers = [];
    quizState.isAnswered = false;
    quizState.startTime = null;
    quizState.endTime = null;
    
    // 返回欢迎页面
    showCard('welcome');
    
    console.log('测验已重置，返回首页');
}

// 显示加载模态框
function showLoadingModal() {
    if (loadingModal) {
        loadingModal.classList.remove('hidden');
        // 禁用页面滚动
        document.body.style.overflow = 'hidden';
        console.log('显示加载模态框');
    }
}

// 隐藏加载模态框
function hideLoadingModal() {
    if (loadingModal) {
        loadingModal.classList.add('hidden');
        // 恢复页面滚动
        document.body.style.overflow = '';
        console.log('隐藏加载模态框');
    }
}
