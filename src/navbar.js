export function createProject(){
    const list = document.getElementById("list");
    const newProject = document.createElement("li");
    newProject.innerHTML=`
    <button><i class="fas fa-home"></i>Home</button>
    `;
    list.appendChild(newProject);
}