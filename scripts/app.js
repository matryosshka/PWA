/*--- Регистрация Service Worker, при загрузке приложения и проверка поддержки функционала в браузерах ---*/
window.addEventListener('load', async () => {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/PWA/sw.js') // GitHub Pages не находит файл по отн.пути: ('/sw.js'), для GHP - работает абс.путь
      console.log('Успешная регистрация service worker', reg);
    } catch (e) {
      console.log('Ошибка регистрации service worker');
    }
  }
})

/*--- Работа плашек FAQ ---*/
const faqs = document.querySelectorAll(".faq");

faqs.forEach((faq) => {
  faq.addEventListener("click", () => {
    if (faq.classList.contains("active")) {
      faq.classList.remove("active");
    } else {
      faqs.forEach((otherFaq) => {
        otherFaq.classList.remove("active");
      });
      faq.classList.add("active");
    }
  });

  const title = faq.querySelector(".faq-title");
  if (title) {
    title.addEventListener("click", (event) => {
      if (faq.classList.contains("active") && event.target === title) {
        faq.classList.remove("active");
      }
    });
  }
});

const hideBtn = document.querySelector('.btn');

hideBtn.addEventListener("click", () => {
  if (hideBtn.textContent === 'Скрыть') {
    const activeFaq = document.querySelector(".faq.active");
    if (activeFaq) {
      activeFaq.classList.remove("active");
    }
  }
}); 

/*--- Работа функционала: "Показать еще": подгрузка вопросов ---*/
const btn = document.querySelector('.btn');
const questions = Array.from(document.querySelectorAll('.faq'));

function showElem() {
  btn.addEventListener('click', () => {
    if (btn.textContent === 'Скрыть') {
      questions.forEach((item, index) => {
        if ((window.innerWidth > 1080 && index > 3) || (window.innerWidth <= 1080 && window.innerWidth > 480 && index > 2) || (window.innerWidth <= 480 && index > 1)) {
          item.classList.add('hidden');
        }
      });
      btn.textContent = 'Показать еще';
    } else {
      questions.forEach((item, index) => {
        if ((window.innerWidth > 1080 && index > 3) || (window.innerWidth <= 1080 && window.innerWidth > 480 && index > 2) || (window.innerWidth <= 480 && index > 1)) {
          item.classList.remove('hidden');
        }
      });
      btn.textContent = 'Скрыть';
    }
  });
}

function resizedw() {
  if (window.innerWidth > 1080) {
    desktop();
  } else if (window.innerWidth <= 1080 && window.innerWidth > 480) {
    tablets();
  } else if (window.innerWidth <= 480) {
    phones();
  }

  let doit;
  let resizedw;
  window.onresize = function () {
    clearTimeout(doit);
    doit = setTimeout(resizedw, 100);
  };
}

function desktop() {
  if (window.innerWidth > 1080) {
    questions.forEach((item, index) => {
      item.classList.add('hidden')
      if (index <= 3) {
        item.classList.remove('hidden')
      } else if (index > 3) {
        btn.classList.remove('hidden');
      }
    })
  }
}

function tablets() {
  if (window.innerWidth <= 1080 && window.innerWidth > 480) {
    questions.forEach((item, index) => {
      item.classList.add('hidden')
      if (index <= 2) {
        item.classList.remove('hidden')
      } else if (index > 2) {
        btn.classList.remove('hidden');
      }
    })
  }
}

function phones() {
  if (window.innerWidth <= 480) {
    questions.forEach((item, index) => {
      item.classList.add('hidden')
      if (index <= 1) {
        item.classList.remove('hidden')
      } else if (index > 1) {
        btn.classList.remove('hidden');
      }
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  btn.classList.add('hidden');
  desktop();
  tablets();
  phones();
  showElem();
});

window.addEventListener('orientationchange', () => {
  location.reload();
});