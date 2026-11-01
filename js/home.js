const featuredStatus = document.getElementById('featuredStatus');
const featuredCards = document.querySelectorAll('#featuredDishes .food-card');

featuredStatus.textContent = 'Loading featured dishes...';
window.restaurantApi.getMenu()
    .then(({ menu }) => {
        const items = menu.flatMap((category) => category.items);

        featuredCards.forEach((card) => {
            const item = items.find((entry) => entry.id === card.dataset.itemId);
            if (!item) {
                return;
            }

            const image = card.querySelector('.food-image img');
            image.src = item.image;
            image.alt = item.name;
            card.querySelector('h3').textContent = item.name;
            card.querySelector('.food-content p').textContent = item.description;
            card.querySelector('.price').textContent = `₹${item.price}`;
        });

        featuredStatus.textContent = '';
    })
    .catch((error) => {
        featuredStatus.textContent = error.message;
        featuredStatus.classList.add('is-error');
    });
