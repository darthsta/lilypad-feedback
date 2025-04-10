# LilyPad Feedback Module

A customer feedback system built with Laravel (backend) and React (frontend) featuring:
- Feedback submission form with emoji ratings
- Filterable feedback display
- Responsive design (mobile-friendly)


## Prerequisites

- PHP 8.0+
- Node.js 16+
- Composer
- MySQL/SQLite

## Installation

**Clone the repository**

   git clone https://github.com/darthsta/lilypad-feedback.git
   cd lilypad-feedback

   composer install

   npm install

   touch database/database.sqlite  # For SQLite Or configure MySQL in .env

  php artisan migrate

  **Use Tinker with FeedbackFactory**

  php artisan tinker
    *then*
    \App\Models\Feedback::factory()->count(10)->create();

  npm run dev
  
  php artisan serve # in separate terminal

  #access the app via http://localhost:8000 
