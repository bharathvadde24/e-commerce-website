const apiUrl = 'https://www.figma.com/file/xG21MiqSOJcUDtJL085wSK/Untitled?type=design&node-id=0%3A1&mode=design&t=2hrQyQz1CrATZn75-1';

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Call the showCategory function with the fetched data
    showCategory('Men', data);
  })
  .catch(error => console.error('Error fetching data:', error));

function showCategory(category, productData) {
  const productCardsContainer = document.getElementById('productCardsContainer');
  productCardsContainer.innerHTML = '';

  document.querySelectorAll('.tabs button').forEach(btn => {
    btn.classList.remove('active');
  });

  const clickedButton = document.getElementById(`${category.toLowerCase()}Button`);
  clickedButton.classList.add('active');

  const categoryData = productData.categories.find(cat => cat.category_name === category);

  if (categoryData) {
    categoryData.category_products.forEach(product => {
      const discountPercentage = calculateDiscountPercentage(product.price, product.compare_at_price);
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');

      // Create image container
      const imageContainer = document.createElement('div');
      imageContainer.classList.add('image-container');

      // Create and add first image
      const image1 = document.createElement('img');
      image1.src = product.image;
      image1.classList.add('active'); // Make the first image visible
      imageContainer.appendChild(image1);

      // Create and add second image if available
      if (product.second_image && product.second_image !== "empty") {
        const image2 = document.createElement('img');
        image2.src = product.second_image;
        imageContainer.appendChild(image2);
      }

      if (product.badge_text) {
        const badge = document.createElement('div');
        badge.innerText = product.badge_text;
        badge.classList.add('badge');
        imageContainer.appendChild(badge);
      }

      productCard.appendChild(imageContainer);

      const productTitle = document.createElement('div');
      productTitle.innerText = product.title;
      productTitle.classList.add('product-title');
      productCard.appendChild(productTitle);

      const vendorAndPrice = document.createElement('div');
      vendorAndPrice.classList.add('vendor-and-price');

      const vendor = document.createElement('div');
      vendor.innerText = `${product.vendor}`;
      vendor.classList.add('vendor-name');
      vendorAndPrice.appendChild(vendor);

      const price = document.createElement('div');
      price.innerText = `Rs ${product.price}`;
      price.classList.add('price');
      vendorAndPrice.appendChild(price);

      productCard.appendChild(vendorAndPrice);

      productCardsContainer.appendChild(productCard);
      if (product.compare_at_price) {
        const compareAtPrice = document.createElement('div');
        compareAtPrice.innerText = `${product.compare_at_price}`;
        compareAtPrice.classList.add('compare-price');
        productCard.appendChild(compareAtPrice);

        const discount = document.createElement('div');
        discount.innerText = `Discount: ${discountPercentage}% off`;
        discount.classList.add('discount');
        productCard.appendChild(discount);
      }

      const addToCartButton = document.createElement('button');
      addToCartButton.innerText = 'Add to Cart';
      addToCartButton.classList.add('add-to-cart-button');
      productCard.appendChild(addToCartButton);

      productCardsContainer.appendChild(productCard);

      // Add logic to handle image scrolling
      handleImageScroll(productCard);
    });
  }
}

function calculateDiscountPercentage(price, compareAtPrice) {
  if (!compareAtPrice) {
    return 0;
  }

  const discount = (1 - price / compareAtPrice) * 100;
  return Math.round(discount);
}

function handleImageScroll(productCard) {
  const imageContainer = productCard.querySelector('.image-container');
  const images = imageContainer.querySelectorAll('img');

  if (images.length > 1) {
    let currentIndex = 0;

    setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;

      // Toggle 'active' class to show/hide images
      images.forEach((image, index) => {
        image.classList.toggle('active', index === currentIndex);
      });
    }, 3000); 
  }
}

// Initial call to display default category
showCategory('Men');

