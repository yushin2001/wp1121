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
  const NewDiary = document.querySelector("#new-diary");
  const diaryTime = document.querySelector("#timing");
  const diaryTagInput = document.querySelector("#diary-tag-input");
  const diaryMoodInput = document.querySelector("#diary-mood-input");
  const diaryDescriptionInput = document.querySelector("#diary-description-input");
  const editPopup = document.querySelector("#editPopup");
  const editclosePopup = document.querySelector("#editclosePopup");
  const addstudy = document.querySelector("#add-study");
  const addrelation = document.querySelector("#add-relation");
  const addclub = document.querySelector("#add-club");
  const addhappy = document.querySelector("#add-happy");
  const addangry = document.querySelector("#add-angry");
  const addsad = document.querySelector("#add-sad");

  /* new-diary button */
  NewDiary.addEventListener("click", function () {
      editPopup.classList.add("show");
      try {
        document.getElementById("timing").innerHTML = createtime();
        diaryTime.value = createtime()
      } catch (error) {
        alert("Failed to load time!");
      }
    });
    addstudy.addEventListener("click", function (){
      diaryTagInput.value = "學業";
    });
    addrelation.addEventListener("click", function (){
      diaryTagInput.value = "人際";
    });
    addclub.addEventListener("click", function (){
      diaryTagInput.value = "社團";
    });
    addhappy.addEventListener("click", function (){
      diaryMoodInput.value = "快樂";
    });
    addangry.addEventListener("click", function (){
      diaryMoodInput.value = "生氣";
    });
    addsad.addEventListener("click", function (){
      diaryMoodInput.value = "難過";
    });
    editclosePopup.addEventListener("click", function () {
      diaryTagInput.value = "";
      diaryMoodInput.value = "";
      diaryDescriptionInput.value = "";
      editPopup.classList.remove("show");
    });
    window.addEventListener("click", function (event) {
      if (event.target == editPopup) {
          diaryTagInput.value = "";
          diaryMoodInput.value = "";
          diaryDescriptionInput.value = "";
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
  const deleteButton = item.querySelector("button.delete-diary");
  deleteButton.dataset.id = diary.id;
  deleteButton.addEventListener("click", () => {
    deleteDiaryElement(diary.id);
  });
  /* popup view window */
  const diaryelement = item.querySelector("button.view-diary");
  const viewPopup = document.querySelector("#viewPopup");
  const viewclosePopup = document.querySelector("#viewclosePopup");
  diaryelement.addEventListener("click", function() {
    const onediary = document.getElementById(diary.id);
    const view_pop_up = document.querySelector(".viewpopup-content");
    view_pop_up.querySelector(".id-of-content").innerHTML = diary.id; /* id記錄在視窗上，但看不到 */
    view_pop_up.querySelector(".top-info").querySelector("p.diary-tag").innerHTML = onediary.querySelector("p.diary-tag").innerHTML;
    view_pop_up.querySelector(".top-info").querySelector("p.diary-mood").innerHTML = onediary.querySelector("p.diary-mood").innerHTML;
    view_pop_up.querySelector(".top-info").querySelector("p.diary-time").innerHTML = onediary.querySelector("p.diary-time").innerHTML;
    view_pop_up.querySelector("p.view-diary-description").innerHTML = onediary.querySelector("p.diary-description").innerHTML;
    viewPopup.classList.add("show");
  });
  viewclosePopup.addEventListener("click", function () {
    viewPopup.classList.remove("show");
  });
  window.addEventListener("click", function (event) {
    if (event.target == viewPopup) {
        viewPopup.classList.remove("show");
    }
  });
  /* view -> edit window */
  const readdDiaryButton = document.querySelector("#re-diary-add");
  const rediaryTime = document.querySelector("#re-timing");
  const rediaryTagInput = document.querySelector("#re-diary-tag-input");
  const rediaryMoodInput = document.querySelector("#re-diary-mood-input");
  const rediaryDescriptionInput = document.querySelector("#re-diary-description-input");
  const editdiary = document.querySelector("#editdiary");
  const reeditPopup = document.querySelector("#reeditPopup");
  const reeditclosePopup = document.querySelector("#reeditclosePopup");
  const editstudy = document.querySelector("#edit-study");
  const editrelation = document.querySelector("#edit-relation");
  const editclub = document.querySelector("#edit-club");
  const edithappy = document.querySelector("#edit-happy");
  const editangry = document.querySelector("#edit-angry");
  const editsad = document.querySelector("#edit-sad");
  editdiary.addEventListener("click", function () {
    viewPopup.classList.remove("show");
    const id_of_content = document.querySelector(".viewpopup-content").querySelector(".id-of-content").innerHTML;
    const onediary = document.getElementById(id_of_content);
    document.querySelector(".re-editpopup-content").querySelector(".id-edit").innerHTML = id_of_content; /* id記錄在視窗上，但看不到 */
    rediaryTime.innerHTML = onediary.querySelector("p.diary-time").innerHTML;
    rediaryTagInput.value = onediary.querySelector("p.diary-tag").innerHTML;
    rediaryMoodInput.value = onediary.querySelector("p.diary-mood").innerHTML;
    rediaryDescriptionInput.value = onediary.querySelector("p.diary-description").innerHTML;
    reeditPopup.classList.add("show");
    editstudy.addEventListener("click", function (){
      rediaryTagInput.value = "學業";
    });
    editrelation.addEventListener("click", function (){
      rediaryTagInput.value = "人際";
    });
    editclub.addEventListener("click", function (){
      rediaryTagInput.value = "社團";
    });
    edithappy.addEventListener("click", function (){
      rediaryMoodInput.value = "快樂";
    });
    editangry.addEventListener("click", function (){
      rediaryMoodInput.value = "生氣";
    });
    editsad.addEventListener("click", function (){
      rediaryMoodInput.value = "難過";
    });
    reeditclosePopup.addEventListener("click", function () {
      reeditPopup.classList.remove("show");
      viewPopup.classList.add("show");
    });
    window.addEventListener("click", function (event) {
      if (event.target == reeditPopup) {
        reeditPopup.classList.remove("show");
      }
    });
    readdDiaryButton.addEventListener("click", function () {
      const retag = rediaryTagInput.value;
      const retime = rediaryTime.innerHTML;
      const remood = rediaryMoodInput.value;
      const redescription = rediaryDescriptionInput.value;
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
      const new_content = {"time": retime, "description": redescription, "tag": retag, "mood": remood};
      try {
        updateDiaryStatus(id_of_content, new_content);
        const element = document.getElementById(id_of_content);
        /* for diary node */
        element.querySelector(".diary-tag").innerText = retag;
        element.querySelector(".diary-time").innerText = retime;
        element.querySelector(".diary-mood").innerText = remood;
        element.querySelector(".diary-description").innerText = redescription;
        reeditPopup.classList.remove("show");
        /* for view popup window */
        const view_pop_up = document.querySelector(".viewpopup-content");
        view_pop_up.querySelector(".id-of-content").innerHTML = diary.id; /* id記錄在視窗上，但看不到 */
        view_pop_up.querySelector(".top-info").querySelector("p.diary-tag").innerHTML = element.querySelector("p.diary-tag").innerHTML;
        view_pop_up.querySelector(".top-info").querySelector("p.diary-mood").innerHTML = element.querySelector("p.diary-mood").innerHTML;
        view_pop_up.querySelector(".top-info").querySelector("p.diary-time").innerHTML = element.querySelector("p.diary-time").innerHTML;
        view_pop_up.querySelector("p.view-diary-description").innerHTML = element.querySelector("p.diary-description").innerHTML;
        viewPopup.classList.add("show");
      } catch (error) {
        alert("Failed to update diary!");
        return;
      }
    });
  });
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