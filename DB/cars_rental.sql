-- 1. جدول المستخدمين (يشمل الـ Admin, Owner, Renter)
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'owner', 'renter') NOT NULL,
    account_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    driver_license_url VARCHAR(255), -- مخصص للمستأجر فقط
    is_license_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. جدول السيارات
CREATE TABLE Cars (
    id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT NOT NULL, -- FK يربط السيارة بمالكها
    title VARCHAR(200) NOT NULL,
    description TEXT,
    car_type VARCHAR(50),
    brand VARCHAR(50),
    model VARCHAR(50),
    year INT,
    transmission ENUM('automatic', 'manual'),
    location VARCHAR(100),
    rental_price DECIMAL(10, 2),
    post_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (owner_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 3. جدول الحجوزات (الذي يربط المستأجر بالسيارة)
CREATE TABLE Bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_id INT NOT NULL, -- FK يربط الحجز بالسيارة
    renter_id INT NOT NULL, -- FK يربط الحجز بالمستأجر
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price DECIMAL(10, 2),
    status ENUM('pending', 'accepted', 'rejected', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES Cars(id) ON DELETE RESTRICT, -- لمنع حذف سيارة محجوزة
    FOREIGN KEY (renter_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 4. جدول التقييمات
CREATE TABLE Reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL, -- FK يربط التقييم برحلة معينة
    car_id INT NOT NULL,
    renter_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    FOREIGN KEY (booking_id) REFERENCES Bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES Cars(id) ON DELETE CASCADE,
    FOREIGN KEY (renter_id) REFERENCES Users(id) ON DELETE CASCADE
);


CREATE TABLE Notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL, -- الشخص المستلم للإشعار
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);