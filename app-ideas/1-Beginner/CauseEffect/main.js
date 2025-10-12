const people = [
  {
    name: "王伟",
    street: "北京朝阳区建国路88号",
    city: "北京",
    state: "北京",
    country: "中国",
    telephone: "+86-10-88888888",
    birthday: "1990-01-15"
  },
  {
    name: "佐藤健",
    street: "東京都新宿区西新宿2-8-1",
    city: "東京",
    state: "東京都",
    country: "日本",
    telephone: "+81-3-1234-5678",
    birthday: "1988-07-22"
  },
  {
    name: "김민수",
    street: "서울특별시 강남구 테헤란로 123",
    city: "서울",
    state: "서울특별시",
    country: "대한민국",
    telephone: "+82-2-9876-5432",
    birthday: "1995-04-10"
  },
  {
    name: "John Smith",
    street: "123 Main St",
    city: "San Francisco",
    state: "California",
    country: "USA",
    telephone: "+1-415-555-1234",
    birthday: "1992-11-05"
  }
];


window.addEventListener('DOMContentLoaded', function () {
  const ul = document.getElementById('employeeList');
  if (ul) {
    people.forEach(person => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = person.name;
      btn.id = person.name;
      li.appendChild(btn);
      ul.appendChild(li);
    });
  }

  // 展示 people 内容到 #welcome（以 JSON 字符串形式，带缩进）
  const welcome = document.getElementById('welcome');
  if (welcome) {
    welcome.textContent = JSON.stringify(people, null, 2);
  }

  // 监听按钮，填充详细信息
  document.getElementById('employeeList')?.addEventListener('click', function (event) {
    if (event.target.tagName !== 'BUTTON') return;
    const id = event.target.id;   

    const person = people.find(p => p.name === id);
    if (!person) return;
    const rightDivs = document.querySelectorAll('.card-body-right > div');
    if (rightDivs.length !== 7) return;
    rightDivs[0].textContent = person.name;
    rightDivs[1].textContent = person.street;
    rightDivs[2].textContent = person.city;
    rightDivs[3].textContent = person.state;
    rightDivs[4].textContent = person.country;
    rightDivs[5].textContent = person.telephone;
    rightDivs[6].textContent = person.birthday;

    // 先移除所有按钮的 selected 类
    document.querySelectorAll('.employee-list li button.selected').forEach(btn => btn.classList.remove('selected'));
    // 当前按钮添加 selected 类
    event.target.classList.add('selected');

    // 显示 card，关闭 welcome
    document.querySelector('.card').style.display = 'block';
    document.getElementById('welcome').style.display = 'none';
  });
});