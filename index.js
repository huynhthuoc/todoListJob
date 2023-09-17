window.onload = () => {
    start()
}
function start() {
    const action = document.querySelector('.action')
    const addClose = document.querySelector('.add-close')
    const createJob = document.querySelector('.create')
    const jobsList = document.querySelector('.jobs-list')
    const checkall = document.querySelector('.job-checkall')

    let isEditJob = true
    let isCreate = true
    let uls;
    let lis;

    //sort Job for id 
    const sortItem = document.querySelector('.sort-icon').children;
    [...sortItem].forEach(e => {
        e.addEventListener('click', i => {
            localStorage.setItem('isSortID', true)
            let btnSort = i.target.classList
            let btnSortIndex = btnSort[btnSort.length - 1]
            if (btnSortIndex === "bx-sort-up") {
                localStorage.setItem('isSortID', 1);
            } else {
                localStorage.setItem('isSortID', 2);
            }
            let id = jobsList.firstElementChild.querySelector('.j2').innerText;

            render()
            location.reload()
        })
    })

    //delete job
    const btnDelete = document.getElementById('div2')
    btnDelete.onclick = () => {
        const checkListOn = [...uls].filter(e => {
            return e.firstElementChild.hasChildNodes()
        })
        const checkListOff = [...uls].filter(e => {
            return !(e.firstElementChild.hasChildNodes())
        })

        const checkIdOff = checkListOff.map(e => {
            return e.querySelector('.j2').innerText;
        })
        const checkIdOn = checkListOn.map(e => {
            return e.querySelector('.j2').innerText;
        })
        if (!(checkIdOn == "")) {
            const comfirm = confirm(`Bạn có chắc muốn xóa Job id: ${checkIdOn.join(", ")}`)
            if (comfirm) {
                checkIdOn.forEach(e => {
                    localStorage.removeItem(e)
                })
                localStorage.setItem('ids', checkIdOff.join('/') + "/")
                render()
                location.reload()
            }
        }

    }
    //render job
    function render() {
        const dataID = localStorage.getItem('ids')
        if (dataID !== "/" && dataID) {
            let data = dataID.split('/').filter(e => e !== "")
            let isSortID = localStorage.getItem("isSortID")
            if (isSortID === "1") {
                data.reverse()
            }
            const htmls = data.map(e => {
                const ob = JSON.parse(localStorage.getItem(e))
                return `
                <ul>
            <li class="j1" class=""></li>
            <li class="j2">${ob.id}</li>
            <li class="j3">${ob.status}</li>
            <li class="j4">${ob.goup}</li>
            <li class="j5">${ob.job}</li>
            <li class="j6">
                <p class="">
                ${ob.contentJob}
                    <i title="Click to show" class='bx bx-expand-horizontal'></i>
                </p>
            </li>
            <li class="j7">${ob.day}/${ob.month}/${ob.year}</li>
            <li class="j8">${ob.getDay}/${ob.getMonth}/${ob.getYear}</li>
            </ul>
            `
            })
            jobsList.innerHTML = htmls.join('')
            if (jobsList.querySelectorAll('ul')) {
                uls = jobsList.querySelectorAll('ul')
                lis = jobsList.querySelectorAll('.j1')
            }
        } else {
            localStorage.removeItem('ids')
        }
        //done job
        if (uls) {
            let xx = localStorage.getItem('idDone')
            if (xx) {
                let data = localStorage.getItem('idDone').split(',')
                uls.forEach(item => {
                    let idItem = item.querySelector('.j2').innerText;
                    data.forEach(e => {
                        if (e === idItem) {
                            item.classList.add('donejob')
                            item.querySelector('.j6 p i').style.display = "none"
                        }
                    })
                })
            }

        }
    } render()


    //inputElements 
    const $ = document.querySelector.bind(document)
    const h1 = $('.add-box h1'),
        status1 = $('#status'),
        statusOption = $('.status option'),
        jobgroup = $('.jobgroup input'),
        jobname = $('.jobname input'),
        deadlineDate = $('.deadline input[name="date"]'),
        deadlineMonth = $('.deadline input[name="month"]'),
        deadlineYear = $('.deadline input[name="year"]'),
        contentJob = $('.jobcontent textarea')
    const ob = {
        h1: h1,
        status: status1,
        goup: jobgroup,
        job: jobname,
        day: deadlineDate,
        month: deadlineMonth,
        year: deadlineYear,
        contentJob: contentJob
    }

    //saved job
    function saved() {
        const btnSaved = document.getElementById('add-job')
        btnSaved.addEventListener('click', savedJob);
        function savedJob() {
            const valueH1 = h1.innerText.split(' ')
            if (!isEditJob || !isCreate) {
                isEditJob = true;
                const dateNow = new Date(Date.now())
                const getDay = dateNow.getDate()
                const getMonth = dateNow.getMonth() + 1
                const getYear = dateNow.getFullYear()
                const pushData = {
                    id: valueH1[valueH1.length - 1],
                    status: ob.status.value,
                    goup: jobgroup.value,
                    job: jobname.value,
                    day: deadlineDate.value,
                    month: deadlineMonth.value,
                    year: deadlineYear.value,
                    contentJob: contentJob.value,
                    getDay: dateNow.getDate(),
                    getMonth: dateNow.getMonth() + 1,
                    getYear: dateNow.getFullYear()
                }
                //set LocalStorage dâta
                localStorage.setItem(pushData.id, JSON.stringify(pushData))
                let ids = localStorage.getItem("ids")
                if (ids) {
                    const newid = (ids + pushData.id) + '/';
                    localStorage.setItem('ids', newid)

                    //filer item ids
                    let id1 = localStorage.getItem("ids")
                    let idData = id1.split('/')
                    let filterData = new Set()
                    idData.forEach(e => filterData.add(e))
                    localStorage.setItem('ids', [...filterData].join('/'))
                } else {
                    localStorage.setItem("ids", pushData.id + '/')
                }
                closeCreateJob()
                render()

                //loading website
                location.reload()

            }
        }
    }
    //editjob 
    function EditJob(btn) {
        btn.addEventListener('click', edit, { once: true })
        function edit() {
            if (isCreate) {
                isEditJob = false
                let valueH1 = ob.h1.innerHTML.split(' ')
                ob.h1.innerHTML = `Edit Job ID ${valueH1[valueH1.length - 1]}`
                for (elm of Object.values(ob)) {
                    elm.style.pointerEvents = "inherit"
                    elm.style.backgroundColor = "white"
                }
                ob.contentJob.removeAttribute('disabled')
                ob.h1.style.backgroundColor = "transparent";
                saved()
            }
        }
    }


    //style contents  
    function disableElement(element, value, color) {
        element.value = value;
        element.style.pointerEvents = "none";
        element.style.backgroundColor = color;
        const icon = status1.nextElementSibling;
        const valuss = status1.value;
        switch (valuss) {
            case 'Warning': icon.className = 'bx bx-confused'
                break;
            case 'Error': icon.className = 'bx bx-tired'
                break;
            case 'Normal': icon.className = 'bx bx-happy-alt'
        }
    }
    //show all contents
    const j6Lists = jobsList.querySelectorAll('.j6 i');
    j6Lists.forEach(item => {
        item.addEventListener('click', e => {
            isCreate = true
            if (isEditJob) {
                const ul = e.target.parentElement.parentElement.parentElement
                let valueP = e.target.parentElement.innerText
                //get item when click!
                const j1 = ul.querySelector('.j1')
                const j2 = ul.querySelector('.j2')
                const j3 = ul.querySelector('.j3')
                const j4 = ul.querySelector('.j4')
                const j5 = ul.querySelector('.j5')
                const j8 = e.target.parentElement.parentElement.nextElementSibling;
                let valueJ8 = j8.innerText.split("/")
                //call
                addElementOption()
                openCreateJob()
                activeList(ul)
                checkList(j1)
                //disable and style elements
                contentJob.value = valueP
                contentJob.setAttribute('disabled', 'disabled')
                contentJob.style.backgroundColor = "#52848f"
                h1.innerHTML = `Show Job ID ${j2.innerText}`
                statusOption.innerText = j3.innerText

                disableElement(statusOption, j3.innerText, "#52848f");
                disableElement(status1, j3.innerText, "#52848f");
                disableElement(jobgroup, j4.innerText, "#52848f");
                disableElement(jobname, j5.innerText, "#52848f");
                disableElement(deadlineDate, valueJ8[0], "#52848f");
                disableElement(deadlineMonth, valueJ8[1], "#52848f");
                disableElement(deadlineYear, valueJ8[2], "#52848f");
                //handle btn edit
                const btnEdit = document.getElementById('div1')
                EditJob(btnEdit)
            }
        })
    })

    //active list
    if (uls) {
        uls.forEach(item => {
            item.addEventListener('click', e => {
                if (isEditJob) {
                    uls.forEach(ul => {
                        const checkIcon = ul.firstElementChild.firstElementChild;
                        if (!(checkIcon)) {
                            ul.classList.remove('active')
                        }
                    })
                    item.classList.add('active')
                }
            })
        })
    }
    function activeList(ul) {
        uls.forEach(item => {
            item.classList.remove('active')
        })
        ul.classList.add('active')
    }
    //check all lists
    checkall.onclick = function () {
        if (isEditJob) {
            checkall.classList.toggle('active')
            uls.forEach(item => {
                const li1 = item.firstElementChild
                if (checkall.classList.contains('active')) {
                    item.classList.add('active')
                    li1.innerHTML = `<i class='bx bx-check'></i>`
                } else {
                    item.classList.remove('active')
                    li1.innerHTML = ''
                }
            })
        }
    }

    //check list 
    if (lis) {
        lis.forEach(li => {
            li.addEventListener('click', () => {
                if (isEditJob) {
                    const ul = li.parentElement;
                    if (li.firstElementChild) {
                        li.innerHTML = ``
                        ul.classList.remove('active')
                    } else {
                        ul.classList.add('active')
                        li.innerHTML = `<i class="bx bx-check"></i>`
                    }
                }
            })
        })

    }

    function checkList(j1) {
        if (lis) {
            lis.forEach(li => {
                if (li.firstElementChild) {
                    li.innerHTML = ``
                }
            })
            j1.innerHTML = `<i class="bx bx-check"></i>`
        }
    }

    //set height jobs-list
    function setHeightJobList() {
        if (jobsList.classList.contains('active')) {
            jobsList.classList.remove('active')
        } else {
            jobsList.classList.add('active')
        }
    }

    //closed Create jobs
    function closeCreateJob() {
        if (isEditJob) {
            const addUP = document.querySelector('.add-up')
            let i = addUP.querySelectorAll('i')
            let px = action.clientHeight;
            let interval = setInterval(() => {
                px -= 4 //px height ++ X4
                if (px < 80) {
                    clearInterval(interval)
                    i[0].style.transform = " translate(52px, -16px) ";
                } else {
                    i[0].style.transform = " translate(52px, -16px) rotate(-45deg)";
                    i[2].style.transform = `rotate(${px}deg)`
                    action.style.height = `${px}px`
                }
            }, 1)

            if (jobsList.classList.contains('active')) {
                setHeightJobList()
            }

        }

    }
    // create Job New 
    function createJobNew() {
        openCreateJob()
        isCreate = false
        if (isEditJob) {
            const ids = jobsList.querySelectorAll('.j2');
            if ([...ids].length >= 1) {
                const lengthIds = ids.length;
                let idsVavlues = [];
                for (i = 0; i < lengthIds; i++) {
                    idsVavlues.push(ids[i].innerText)
                }
                const newID = Math.max(...idsVavlues);
                ob.h1.innerText = `Create Job New ID ${newID + 1}`

                for (elm of Object.values(ob)) {
                    elm.style.pointerEvents = "inherit"
                    elm.style.backgroundColor = "white"
                    elm.value = ''
                }
                ob.contentJob.removeAttribute('disabled')
                ob.h1.style.backgroundColor = "transparent";
                saved()
            } else {
                ob.h1.innerText = `Create Job New ID 1`
                saved()
            }

        }


    }
    //open Create jobs
    function openCreateJob() {
        const addUP = document.querySelector('.add-up')
        let span = addUP.lastElementChild;
        let i = addUP.querySelectorAll('i')
        let px = action.clientHeight;

        let interval = setInterval(() => {
            px += 4 //px height -- X4

            if (px > 260) {
                clearInterval(interval)
                i[0].style.transform = " translate(52px, -16px) ";
            } else {
                i[0].style.transform = " translate(52px, -16px) rotate(-45deg)";
                i[2].style.transform = `rotate(${px}deg)`
                action.style.height = `${px}px`
                span.style.height = `${px}px`
            }
        }, 1)

        if (!(jobsList.classList.contains('active'))) {
            setHeightJobList()
        }
        setIconStatus()
    }
    createJob.addEventListener('click', createJobNew);
    addClose.addEventListener('click', closeCreateJob);


    //add ++ option for status
    function addElementOption() {
        const options = status1.querySelectorAll('option')
        const elementOption = document.createElement('option')
        elementOption.innerHTML = 'Normal'
        if (options.length < 4) {
            status1.appendChild(elementOption)
        }
    }

    //set icon status
    function setIconStatus() {
        status1.addEventListener('click', e => {
            const icon = status1.nextElementSibling;
            const value = e.target.value.toUpperCase();
            switch (value) {
                case 'WARNING': icon.className = 'bx bx-confused'
                    break;
                case 'ERROR': icon.className = 'bx bx-tired'
                    break;
                case 'NORMAL': icon.className = 'bx bx-happy-alt'
            }

        })
    }

    //set icon status
    function setIconStatus() {
        status1.addEventListener('click', e => {
            const icon = status1.nextElementSibling;
            const value = e.target.value.toUpperCase();
            switch (value) {
                case 'WARNING': icon.className = 'bx bx-confused'
                    break;
                case 'ERROR': icon.className = 'bx bx-tired'
                    break;
                case 'NORMAL': icon.className = 'bx bx-happy-alt'
            }
        })
    }
    //style list jobs
    if (uls) {
        uls.forEach((item, index) => {
            if (index % 2 == 0) {
                item.style.backgroundColor = "#1f2630d1"
            } else {
                item.style.backgroundColor = "#525866d4"
            }
        })
    }


    //doned job
    const doneJob = document.querySelector('.more')
    doneJob.onclick = () => {
        const checkListOn = [...uls].filter(e => {
            return e.firstElementChild.hasChildNodes()
        })
        //style done
        checkListOn.forEach(item => {
            item.classList.toggle('donejob')
            let iconShow = item.querySelector('p').firstElementChild;
            if (item.classList.contains('donejob')) {
                iconShow.style.display = "none"
            } else {
                iconShow.style.display = "block"
            }
        })
        //set Localstogare
        const classDoneJob = [...uls].filter(item => {
            return item.classList.contains('donejob')
        })
        const ids = classDoneJob.map(item => {
            return item.querySelector('.j2').innerText;
        })
        localStorage.setItem('idDone', ids)
    }
}

