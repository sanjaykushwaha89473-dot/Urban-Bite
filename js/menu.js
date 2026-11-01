const menuItems = document.getElementById('menuItems');
const menuStatus = document.getElementById('menuStatus');
const orderDialog = document.getElementById('orderDialog');
const orderForm = document.getElementById('orderForm');
const orderStatus = document.getElementById('orderStatus');
const selectedDish = document.getElementById('selectedDish');
const orderQuantity = document.getElementById('orderQuantity');
let menuData = [];
let selectedItem;

function createMenuCard(item) {
    const column = document.createElement('div');
    column.className = 'col-lg-4 col-md-6';

    const card = document.createElement('div');
    card.className = 'food-card';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'food-img';

    const image = document.createElement('img');
    image.src = item.image;
    image.alt = item.name;
    image.loading = 'lazy';
    imageContainer.append(image);

    const content = document.createElement('div');
    content.className = 'food-content';

    const title = document.createElement('h3');
    title.textContent = item.name;

    const description = document.createElement('p');
    description.textContent = item.description;

    const priceAndButton = document.createElement('div');
    priceAndButton.className = 'price-btn';

    const price = document.createElement('span');
    price.textContent = `₹${item.price}`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'order-button';
    button.dataset.itemId = item.id;
    button.textContent = 'Order Now';

    priceAndButton.append(price, button);
    content.append(title, description, priceAndButton);
    card.append(imageContainer, content);
    column.append(card);

    return column;
}

menuItems.addEventListener('click', (event) => {
    const button = event.target.closest('.order-button');
    if (!button) {
        return;
    }

    selectedItem = menuData.find((item) => item.id === button.dataset.itemId);
    if (!selectedItem) {
        menuStatus.textContent = 'This menu item is no longer available.';
        menuStatus.classList.add('is-error');
        return;
    }

    selectedDish.textContent = `${selectedItem.name} - ₹${selectedItem.price}`;
    orderStatus.textContent = '';
    orderStatus.classList.remove('is-error');
    orderForm.reset();
    orderDialog.showModal();
    document.getElementById('customerName').focus();
});

document.getElementById('closeOrderDialog').addEventListener('click', () => {
    orderDialog.close();
});

orderForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!selectedItem) {
        return;
    }

    const submitButton = orderForm.querySelector('.order-submit');
    submitButton.disabled = true;
    orderStatus.textContent = 'Submitting your order...';
    orderStatus.classList.remove('is-error');

    try {
        const result = await window.restaurantApi.createOrder({
            itemId: selectedItem.id,
            customerName: orderForm.elements.customerName.value.trim(),
            phone: orderForm.elements.phone.value.trim(),
            quantity: Number(orderQuantity.value),
        });
        orderDialog.close();
        menuStatus.textContent = result.message;
        menuStatus.classList.remove('is-error');
        orderForm.reset();
    } catch (error) {
        orderStatus.textContent = error.message;
        orderStatus.classList.add('is-error');
    } finally {
        submitButton.disabled = false;
    }
});

menuStatus.textContent = 'Loading menu...';
window.restaurantApi.getMenu()
    .then(({ menu }) => {
        menuData = menu.flatMap((category) => category.items);
        if (!menuData.length) {
            throw new Error('The menu is currently unavailable.');
        }

        menuItems.replaceChildren(...menuData.map(createMenuCard));
        menuStatus.textContent = '';
    })
    .catch((error) => {
        menuItems.replaceChildren();
        menuStatus.textContent = error.message;
        menuStatus.classList.add('is-error');
    });
