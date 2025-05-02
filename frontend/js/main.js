const API_URL = 'http://localhost:8080/api';
let groups = [];
let idols = [];
let currentItemToDelete = { type: null, id: null };

const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const closeModalBtns = document.querySelectorAll('.close-modal');

const groupForm = document.getElementById('group-form');
const groupsContainer = document.getElementById('groups-container');
const groupsLoader = document.getElementById('groups-loader');
const groupsEmpty = document.getElementById('groups-empty');
const groupSearchInput = document.getElementById('group-search');
const groupSearchBtn = document.getElementById('group-search-btn');
const groupAlertSuccess = document.getElementById('group-alert-success');
const groupAlertDanger = document.getElementById('group-alert-danger');

const idolForm = document.getElementById('idol-form');
const idolsContainer = document.getElementById('idols-container');
const idolsLoader = document.getElementById('idols-loader');
const idolsEmpty = document.getElementById('idols-empty');
const idolSearchInput = document.getElementById('idol-search');
const idolSearchBtn = document.getElementById('idol-search-btn');
const idolFilterGroup = document.getElementById('idol-filter-group');
const idolAlertSuccess = document.getElementById('idol-alert-success');
const idolAlertDanger = document.getElementById('idol-alert-danger');

// Elementos para modales
const editGroupModal = document.getElementById('edit-group-modal');
const editIdolModal = document.getElementById('edit-idol-modal');
const viewGroupModal = document.getElementById('view-group-modal');
const viewIdolModal = document.getElementById('view-idol-modal');
const confirmDeleteModal = document.getElementById('confirm-delete-modal');
const editGroupForm = document.getElementById('edit-group-form');
const editIdolForm = document.getElementById('edit-idol-form');
const saveEditGroupBtn = document.getElementById('save-edit-group');
const cancelEditGroupBtn = document.getElementById('cancel-edit-group');
const saveEditIdolBtn = document.getElementById('save-edit-idol');
const cancelEditIdolBtn = document.getElementById('cancel-edit-idol');
const closeViewGroupBtn = document.getElementById('close-view-group');
const closeViewIdolBtn = document.getElementById('close-view-idol');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');

// Funciones de utilidad
function showAlert(element, type, message, duration = 3000) {
    element.textContent = message;
    element.classList.add('show');

    setTimeout(() => {
        element.classList.remove('show');
    }, duration);
}

function formatDate(dateString) {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Event Listeners

// Cambiar entre pestañas
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');

        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Cerrar modales
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-backdrop');
        closeModal(modal);
    });
});

closeViewGroupBtn.addEventListener('click', () => closeModal(viewGroupModal));
closeViewIdolBtn.addEventListener('click', () => closeModal(viewIdolModal));
cancelEditGroupBtn.addEventListener('click', () => closeModal(editGroupModal));
cancelEditIdolBtn.addEventListener('click', () => closeModal(editIdolModal));
cancelDeleteBtn.addEventListener('click', () => closeModal(confirmDeleteModal));

// Funciones para Grupos

// Obtener todos los grupos
async function fetchGroups() {
    groupsLoader.style.display = 'flex';
    groupsContainer.innerHTML = '';

    try {
        const response = await fetch(`${API_URL}/groups`);
        if (!response.ok) throw new Error('Error al cargar los grupos');

        groups = await response.json();

        if (groups.length === 0) {
            groupsEmpty.style.display = 'block';
        } else {
            groupsEmpty.style.display = 'none';
            renderGroups(groups);
        }

        // Actualizar los selectores de grupos
        updateGroupSelects();

    } catch (error) {
        showAlert(groupAlertDanger, 'danger', error.message);
        console.error('Error:', error);
    } finally {
        groupsLoader.style.display = 'none';
    }
}

// Renderizar grupos en la interfaz
function renderGroups(groupsToRender) {
    groupsContainer.innerHTML = '';

    groupsToRender.forEach(group => {
        const card = document.createElement('div');
        card.className = 'card';



        card.innerHTML = `
            <div class="card-header">
                <h3>${group.name}</h3>
            </div>

            <div class="card-body">
                <div class="card-detail">
                    <i class="fas fa-building"></i>
                    <span>${group.company || 'No disponible'}</span>
                </div>
                <div class="card-detail">
                    <i class="fas fa-calendar-day"></i>
                    <span>Debut: ${formatDate(group.debutDate)}</span>
                </div>
                <div class="card-detail">
                    <i class="fas fa-heart"></i>
                    <span>Fandom: ${group.fandomName || 'No disponible'}</span>
                </div>
                <div class="card-detail">
                    <i class="fas ${group.active ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    <span>Estado: ${group.active ? 'Activo' : 'Inactivo'}</span>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary view-group" data-id="${group.id}">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn btn-secondary edit-group" data-id="${group.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-danger delete-group" data-id="${group.id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;

        groupsContainer.appendChild(card);
    });

    // Agregar event listeners a los botones
    document.querySelectorAll('.view-group').forEach(btn => {
        btn.addEventListener('click', () => viewGroup(btn.getAttribute('data-id')));
    });

    document.querySelectorAll('.edit-group').forEach(btn => {
        btn.addEventListener('click', () => openEditGroupModal(btn.getAttribute('data-id')));
    });

    document.querySelectorAll('.delete-group').forEach(btn => {
        btn.addEventListener('click', () => confirmDelete('group', btn.getAttribute('data-id')));
    });
}

// Crear grupo
groupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newGroup = {
        name: document.getElementById('group-name').value,
        company: document.getElementById('group-company').value,
        debutDate: document.getElementById('group-debut').value || null,
        fandomName: document.getElementById('group-fandom').value,
        active: true
    };

    try {
        const response = await fetch(`${API_URL}/groups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newGroup)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear el grupo');
        }

        const createdGroup = await response.json();
        groups.push(createdGroup);

        showAlert(groupAlertSuccess, 'success', 'Grupo creado con éxito');
        groupForm.reset();
        fetchGroups();

    } catch (error) {
        showAlert(groupAlertDanger, 'danger', error.message);
        console.error('Error:', error);
    }
});

// Ver detalles de grupo
async function viewGroup(groupId) {
    try {
        const response = await fetch(`${API_URL}/groups/${groupId}`);
        if (!response.ok) throw new Error('Error al cargar los detalles del grupo');

        const group = await response.json();

        document.getElementById('view-group-title').textContent = group.name;

        const detailsHtml = `
            <div class="card-detail">
                <i class="fas fa-building"></i>
                <span><strong>Compañía:</strong> ${group.company || 'No disponible'}</span>
            </div>
            <div class="card-detail">
                <i class="fas fa-calendar-day"></i>
                <span><strong>Fecha de Debut:</strong> ${formatDate(group.debutDate)}</span>
            </div>
            <div class="card-detail">
                <i class="fas fa-heart"></i>
                <span><strong>Fandom:</strong> ${group.fandomName || 'No disponible'}</span>
            </div>
            <div class="card-detail">
                <i class="fas ${group.active ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                <span><strong>Estado:</strong> ${group.active ? 'Activo' : 'Inactivo'}</span>
            </div>
            <div class="card-detail">
                <i class="fas fa-clock"></i>
                <span><strong>Creado:</strong> ${formatDate(group.createdAt)}</span>
            </div>
            <div class="card-detail">
                <i class="fas fa-edit"></i>
                <span><strong>Actualizado:</strong> ${formatDate(group.updatedAt)}</span>
            </div>
        `;

        document.getElementById('view-group-details').innerHTML = detailsHtml;

        // Renderizar miembros
        const membersContainer = document.getElementById('view-group-members');
        membersContainer.innerHTML = '';

        if (group.members && group.members.length > 0) {
            group.members.forEach(member => {
                const memberItem = document.createElement('div');
                memberItem.className = 'member-item';



                memberItem.innerHTML = `
                
                    <div class="member-name">
                        <strong>${member.stageName}</strong>
                        ${member.position ? `<div><small>${member.position}</small></div>` : ''}
                    </div>
                `;

                membersContainer.appendChild(memberItem);
            });
        } else {
            membersContainer.innerHTML = '<p>Este grupo no tiene miembros registrados.</p>';
        }

        openModal(viewGroupModal);

    } catch (error) {
        showAlert(groupAlertDanger, 'danger', error.message);
        console.error('Error:', error);
    }
}

// Abrir modal para editar grupo
function openEditGroupModal(groupId) {
    const group = groups.find(g => g.id == groupId);

    if (!group) {
        showAlert(groupAlertDanger, 'danger', 'Grupo no encontrado');
        return;
    }

    document.getElementById('edit-group-id').value = group.id;
    document.getElementById('edit-group-name').value = group.name;
    document.getElementById('edit-group-company').value = group.company || '';
    document.getElementById('edit-group-debut').value = group.debutDate ? group.debutDate.split('T')[0] : '';
    document.getElementById('edit-group-fandom').value = group.fandomName || '';
    document.getElementById('edit-group-active').value = group.active.toString();

    openModal(editGroupModal);
}

// Guardar cambios en grupo
saveEditGroupBtn.addEventListener('click', async () => {
    const groupId = document.getElementById('edit-group-id').value;

    const updatedGroup = {
        name: document.getElementById('edit-group-name').value,
        company: document.getElementById('edit-group-company').value,
        debutDate: document.getElementById('edit-group-debut').value || null,
        fandomName: document.getElementById('edit-group-fandom').value,
        active: document.getElementById('edit-group-active').value === 'true'
    };

    try {
        const response = await fetch(`${API_URL}/groups/${groupId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedGroup)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar el grupo');
        }

        showAlert(groupAlertSuccess, 'success', 'Grupo actualizado con éxito');
        closeModal(editGroupModal);
        fetchGroups();

    } catch (error) {
        showAlert(groupAlertDanger, 'danger', error.message);
        console.error('Error:', error);
    }
});

// Confirmar eliminación
function confirmDelete(type, id) {
    currentItemToDelete = { type, id };

    const message = type === 'group'
        ? '¿Estás seguro de que deseas eliminar este grupo? Esta acción también eliminará todos sus miembros.'
        : '¿Estás seguro de que deseas eliminar este idol?';

    document.getElementById('confirm-delete-message').textContent = message;

    openModal(confirmDeleteModal);
}

// Eliminar item confirmado
confirmDeleteBtn.addEventListener('click', async () => {
    const { type, id } = currentItemToDelete;

    try {
        const endpoint = type === 'group' ? `${API_URL}/groups/${id}` : `${API_URL}/idols/${id}`;

        const response = await fetch(endpoint, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `Error al eliminar ${type === 'group' ? 'el grupo' : 'el idol'}`);
        }

        if (type === 'group') {
            showAlert(groupAlertSuccess, 'success', 'Grupo eliminado con éxito');
            fetchGroups();
        } else {
            showAlert(idolAlertSuccess, 'success', 'Idol eliminado con éxito');
            fetchIdols();
        }

        closeModal(confirmDeleteModal);

    } catch (error) {
        const alertElement = type === 'group' ? groupAlertDanger : idolAlertDanger;
        showAlert(alertElement, 'danger', error.message);
        console.error('Error:', error);
        closeModal(confirmDeleteModal);
    }
});

// Buscar grupos
groupSearchBtn.addEventListener('click', () => {
    const searchTerm = groupSearchInput.value.toLowerCase();

    if (searchTerm.trim() === '') {
        renderGroups(groups);
        return;
    }

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchTerm) ||
        (group.company && group.company.toLowerCase().includes(searchTerm)) ||
        (group.fandomName && group.fandomName.toLowerCase().includes(searchTerm))
    );

    if (filteredGroups.length === 0) {
        groupsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No se encontraron resultados</h3>
                <p>Intenta con otros términos de búsqueda</p>
            </div>
        `;
    } else {
        renderGroups(filteredGroups);
    }
});

// Actualizar selectores de grupos
function updateGroupSelects() {
    const selects = [
        document.getElementById('idol-group'),
        document.getElementById('edit-idol-group'),
        document.getElementById('idol-filter-group')
    ];

    selects.forEach(select => {
        // Mantener la primera opción (valor vacío)
        const firstOption = select.options[0];
        select.innerHTML = '';
        select.appendChild(firstOption);

        groups.forEach(group => {
            const option = document.createElement('option');
            option.value = group.id;
            option.textContent = group.name;
            select.appendChild(option);
        });
    });
}

// Funciones para Idols

// Obtener todos los idols
async function fetchIdols() {
    idolsLoader.style.display = 'flex';
    idolsContainer.innerHTML = '';

    try {
        const response = await fetch(`${API_URL}/idols`);
        if (!response.ok) throw new Error('Error al cargar los idols');

        idols = await response.json();

        if (idols.length === 0) {
            idolsEmpty.style.display = 'block';
        } else {
            idolsEmpty.style.display = 'none';
            renderIdols(idols);
        }

    } catch (error) {
        showAlert(idolAlertDanger, 'danger', error.message);
        console.error('Error:', error);
    } finally {
        idolsLoader.style.display = 'none';
    }
}

// Renderizar idols en la interfaz
function renderIdols(idolsToRender) {
    idolsContainer.innerHTML = '';

    idolsToRender.forEach(idol => {
        const card = document.createElement('div');
        card.className = 'card';

        const groupName = idol.group ? idol.group.name : 'Desconocido';

        card.innerHTML = `
            <div class="card-header">
                <h3>${idol.stageName}</h3>
            </div>
            <div class="card-body">
                <div class="card-detail">
                    <i class="fas fa-user"></i>
                    <span>${idol.realName || 'No disponible'}</span>
                </div>
                <div class="card-detail">
                    <i class="fas fa-users"></i>
                    <span>Grupo: ${groupName}</span>
                </div>
                <div class="card-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Nacionalidad: ${idol.nationality || 'No disponible'}</span>
                </div>
                ${idol.position ? `
                <div class="card-detail">
                    <i class="fas fa-star"></i>
                    <span>Posición: ${idol.position}</span>
                </div>
                ` : ''}
                <div class="card-actions">
                    <button class="btn btn-primary view-idol" data-id="${idol.id}">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn btn-secondary edit-idol" data-id="${idol.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-danger delete-idol" data-id="${idol.id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;

        idolsContainer.appendChild(card);
    });

    // Agregar event listeners a los botones
    document.querySelectorAll('.view-idol').forEach(btn => {
        btn.addEventListener('click', () => viewIdol(btn.getAttribute('data-id')));
    });

    document.querySelectorAll('.edit-idol').forEach(btn => {
        btn.addEventListener('click', () => openEditIdolModal(btn.getAttribute('data-id')));
    });

    document.querySelectorAll('.delete-idol').forEach(btn => {
        btn.addEventListener('click', () => confirmDelete('idol', btn.getAttribute('data-id')));
    });
}

// Crear idol
idolForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newIdol = {
        stageName: document.getElementById('idol-stage-name').value,
        realName: document.getElementById('idol-real-name').value,
        birthday: document.getElementById('idol-birthday').value || null,
        nationality: document.getElementById('idol-nationality').value,
        position: document.getElementById('idol-position').value,
        groupId: document.getElementById('idol-group').value
    };

    try {
        const response = await fetch(`${API_URL}/idols`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newIdol)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear el idol');
        }

        const createdIdol = await response.json();
        idols.push(createdIdol);

        showAlert(idolAlertSuccess, 'success', 'Idol creado con éxito');
        idolForm.reset();
        fetchIdols();

    } catch (error) {
        showAlert(idolAlertDanger, 'danger', error.message);
        console.error('Error:', error);
    }
});

// Ver detalles de idol
async function viewIdol(idolId) {
    try {
        const response = await fetch(`${API_URL}/idols/${idolId}`);
        if (!response.ok) throw new Error('Error al cargar los detalles del idol');

        const idol = await response.json();

        document.getElementById('view-idol-title').textContent = idol.stageName;

        const groupName = idol.group ? idol.group.name : 'Desconocido';

        const detailsHtml = `
            <div class="card-detail">
                <i class="fas fa-user"></i>
                <span><strong>Nombre Real:</strong> ${idol.realName || 'No disponible'}</span>
            </div>
            <div class="card-detail">
                <i class="fas fa-calendar-day"></i>
                <span><strong>Fecha de Nacimiento:</strong> ${formatDate(idol.birthday)}</span>
            </div>
            <div class="card-detail">
                <i class="fas fa-map-marker-alt"></i>
                <span><strong>Nacionalidad:</strong> ${idol.nationality || 'No disponible'}</span>
            </div>
            <div class="card-detail">
                <i class="fas fa-users"></i>
                <span><strong>Grupo:</strong> ${groupName}</span>
            </div>
            ${idol.position ? `
            <div class="card-detail">
                <i class="fas fa-star"></i>
                <span><strong>Posición:</strong> ${idol.position}</span>
            </div>
            ` : ''}
            <div class="card-detail">
                <i class="fas fa-clock"></i>
                <span><strong>Creado:</strong> ${formatDate(idol.createdAt)}</span>
            </div>
            <div class="card-detail">
                <i class="fas fa-edit"></i>
                <span><strong>Actualizado:</strong> ${formatDate(idol.updatedAt)}</span>
            </div>
        `;

        document.getElementById('view-idol-details').innerHTML = detailsHtml;

        openModal(viewIdolModal);

    } catch (error) {
        showAlert(idolAlertDanger, 'danger', error.message);
        console.error('Error:', error);
    }
}

// Abrir modal para editar idol
function openEditIdolModal(idolId) {
    const idol = idols.find(i => i.id == idolId);

    if (!idol) {
        showAlert(idolAlertDanger, 'danger', 'Idol no encontrado');
        return;
    }

    document.getElementById('edit-idol-id').value = idol.id;
    document.getElementById('edit-idol-stage-name').value = idol.stageName;
    document.getElementById('edit-idol-real-name').value = idol.realName || '';
    document.getElementById('edit-idol-birthday').value = idol.birthday ? idol.birthday.split('T')[0] : '';
    document.getElementById('edit-idol-nationality').value = idol.nationality || '';
    document.getElementById('edit-idol-position').value = idol.position || '';
    document.getElementById('edit-idol-group').value = idol.groupId;

    openModal(editIdolModal);
}

// Guardar cambios en idol
saveEditIdolBtn.addEventListener('click', async () => {
    const idolId = document.getElementById('edit-idol-id').value;

    const updatedIdol = {
        stageName: document.getElementById('edit-idol-stage-name').value,
        realName: document.getElementById('edit-idol-real-name').value,
        birthday: document.getElementById('edit-idol-birthday').value || null,
        nationality: document.getElementById('edit-idol-nationality').value,
        position: document.getElementById('edit-idol-position').value,
        groupId: document.getElementById('edit-idol-group').value
    };

    try {
        const response = await fetch(`${API_URL}/idols/${idolId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedIdol)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar el idol');
        }

        showAlert(idolAlertSuccess, 'success', 'Idol actualizado con éxito');
        closeModal(editIdolModal);
        fetchIdols();

    } catch (error) {
        showAlert(idolAlertDanger, 'danger', error.message);
        console.error('Error:', error);
    }
});

// Buscar y filtrar idols
idolSearchBtn.addEventListener('click', () => {
    const searchTerm = idolSearchInput.value.toLowerCase();
    const filterGroupId = idolFilterGroup.value;

    let filteredIdols = [...idols];

    // Filtrar por grupo si se seleccionó uno
    if (filterGroupId) {
        filteredIdols = filteredIdols.filter(idol => idol.groupId == filterGroupId);
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== '') {
        filteredIdols = filteredIdols.filter(idol =>
            idol.stageName.toLowerCase().includes(searchTerm) ||
            (idol.realName && idol.realName.toLowerCase().includes(searchTerm)) ||
            (idol.nationality && idol.nationality.toLowerCase().includes(searchTerm)) ||
            (idol.position && idol.position.toLowerCase().includes(searchTerm))
        );
    }

    if (filteredIdols.length === 0) {
        idolsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No se encontraron resultados</h3>
                <p>Intenta con otros términos de búsqueda o filtros</p>
            </div>
        `;
    } else {
        renderIdols(filteredIdols);
    }
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    fetchGroups();
    fetchIdols();
});