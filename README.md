# FoodLoop

FoodLoop is a static website concept for a fictional, future-focused food brand. It presents a polished landing page and an interactive storefront as a front-end demonstration. **It is not a real food business or online store.**

## About the project

I was inspired by another website for the visual concept and used AI tools, including an AI agent prompted by me, to generate this project. The content, brand, products, prices, statistics, and sustainability or nutrition claims are fictional and are included for demonstration only. This project is not affiliated with the website that inspired it.

## Website images

These are food images used in the website's hero gallery:

<p align="center">
  <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80" alt="Colorful salad from the FoodLoop hero gallery" width="31%">
  <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80" alt="Fresh vegetable bowl from the FoodLoop hero gallery" width="31%">
  <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80" alt="Pizza from the FoodLoop hero gallery" width="31%">
</p>

The images are loaded from Unsplash and require an internet connection. They are the images displayed on the site, not screenshots of the page.

## Features

- Responsive single-page layout with Home, Story, Visions, Recipes, Shop, and footer sections
- Product cards with category filters, badges, and quick-view details
- Demo shopping cart with quantity controls, subtotal, and a sample `LOOP10` coupon for 10% off
- Wishlist and light/dark theme preferences saved in browser local storage
- Animated page loading, scroll reveals, progress indicator, and hover effects
- Mobile navigation menu

## Built with

- HTML
- CSS
- JavaScript
- GSAP and ScrollTrigger for animation
- Google Fonts and Remix Icon for typography and icons
- Unsplash-hosted images

The project has no build step or package manager dependencies. Some visual assets and effects rely on third-party services, so an internet connection is needed for the complete experience.

## Run locally

Clone or download the repository, then serve the project directory with a local web server. If Python 3 is installed, run:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000> in your browser. You can also open `index.html` directly, though using a local server is recommended.

## Project files

```text
FoodLoop/
├── index.html   # Page content and layout
├── style.css    # Styling, responsive rules, and themes
├── script.js    # Interactions, cart, wishlist, and animations
├── README.md    # Project overview and run instructions
└── .gitignore   # Local editor and operating-system files to ignore
```

## Demo limitations

This is a front-end-only demonstration:

- Cart and wishlist contents are saved only in the current browser's local storage.
- Checkout only shows a demo confirmation. It does not create an order, process payment, or contact a server.
- Product availability, prices, statistics, and claims are fictional.
- There is no user account, inventory system, or backend.

Do not enter payment details or treat the site as a real source of food, nutrition, or sustainability information.

## Credits and reuse

The site uses remotely hosted images, fonts, icons, and animation libraries. Review the applicable licenses and service terms before redistributing those assets or using them commercially. The visual concept was inspired by another website; check permissions and avoid copying its protected text, images, branding, or other distinctive material.

This repository currently has no license. Unless a license is added, the default copyright rules apply and others do not have permission to reuse, modify, or distribute the project.
