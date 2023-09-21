/* global axios */
const itemTemplate = document.querySelector("#diary-item-template");
const DiaryList = document.querySelector("#diaries");

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

async function main() {
  setupEventListeners();
  try {
    const diaries = await getDiaries();
    diaries.forEach((diary) => renderDiary(diary));
  } catch (error) {
    alert("Failed to load diaries!");
  }
}

function setupEventListeners() {
  const addDiaryButton = document.querySelector("#diary-add");
  const diaryTime = document.querySelector("#timing");
  const diaryTagInput = document.querySelector("#diary-tag-input");
  const diaryMoodInput = document.querySelector("#diary-mood-input");
  const diaryDescriptionInput = document.querySelector("#diary-description-input");

  /* new-diary button */
  const NewDiary = document.querySelector("#new-diary");
  NewDiary.addEventListener("click", function () {
        editPopup.classList.add("show");
        try {
          document.getElementById("timing").innerHTML = createtime();
          diaryTime.value = createtime()
        } catch (error) {
          alert("Failed to load time!");
        }
    });
    closePopup.addEventListener("click", function () {
        editPopup.classList.remove("show");
    });
    window.addEventListener("click", function (event) {
        if (event.target == editPopup) {
            editPopup.classList.remove("show");
        }
    });
    
  /* diary-add button */
  addDiaryButton.addEventListener("click", async () => {
    const tag = diaryTagInput.value;
    const time = diaryTime.value;
    const mood = diaryMoodInput.value;
    const description = diaryDescriptionInput.value;
    if (!tag) {
      alert("Please enter a diary tag!");
      return;
    }
    if (!mood) {
      alert("Please enter a diary mood!");
      return;
    }
    if (!description) {
      alert("Please enter a diary description!");
      return;
    }
    try {
      const diary = await createDiary({ time, description, tag, mood });
      renderDiary(diary);
    } catch (error) {
      alert("Failed to create diary!");
      return;
    }
    diaryTagInput.value = "";
    diaryMoodInput.value = "";
    diaryDescriptionInput.value = "";
    editPopup.classList.remove("show");
  });
}

function renderDiary(diary) {
  const item = createDiaryElement(diary);
  DiaryList.appendChild(item);
}

function createDiaryElement(diary) {
  const item = itemTemplate.content.cloneNode(true);
  const container = item.querySelector(".diary-item");
  container.id = diary.id;
  const tag = item.querySelector("p.diary-tag");
  tag.innerText = diary.tag;
  const mood = item.querySelector("p.diary-mood");
  mood.innerText = diary.mood;
  const time = item.querySelector("p.diary-time");
  time.innerText = diary.time;
  const description = item.querySelector("p.diary-description");
  description.innerText = diary.description;
  return item;
}

async function deleteDiaryElement(id) {
  try {
    await deleteDiaryById(id);
  } catch (error) {
    alert("Failed to delete diary!");
  } finally {
    const diary = document.getElementById(id);
    diary.remove();
  }
}

async function getDiaries() {
  const response = await instance.get("/diaries");
  return response.data;
}

async function createDiary(diary) {
  const response = await instance.post("/diaries", diary);
  return response.data;
}

// eslint-disable-next-line no-unused-vars
async function updateDiaryStatus(id, diary) {
  const response = await instance.put(`/diaries/${id}`, diary);
  return response.data;
}

async function deleteDiaryById(id) {
  const response = await instance.delete(`/diaries/${id}`);
  return response.data;
}

// for timestamp
function createtime(){
  const dayNamesZh = [ '日', '一', '二', '三', '四', '五', '六']
  let dateObject = new Date()
  let date = dateObject.getDate()
  if (date < 10){
    date = '0'+ date
  }
  let day = dayNamesZh[dateObject.getDay()]
  let month = dateObject.getMonth() + 1
  if (month < 10){
    month = '0'+ month
  }
  let year = dateObject.getFullYear()
  let formattedDate = year + '.' + month + '.' + date + '(' + day + ')'
  return formattedDate;
}

main();