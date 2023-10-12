-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-02-2023 a las 20:25:11
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `i-nimble_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'Employee'),
(2, 'Employer');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `task_name` varchar(150) NOT NULL,
  `description` varchar(300) NOT NULL,
  `tracker_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `time_tracker`
--

CREATE TABLE `time_tracker` (
  `id` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `date` date NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `time_tracker`
--

INSERT INTO `time_tracker` (`id`, `start_time`, `end_time`, `date`, `user_id`) VALUES
(8, '2023-02-01 13:49:50', '0000-00-00 00:00:00', '2023-02-01', 1),
(9, '2023-02-01 14:28:49', '0000-00-00 00:00:00', '2023-02-01', 1),
(10, '2023-02-03 09:57:00', '2023-02-03 10:00:00', '2023-02-03', 17),
(11, '2023-02-01 14:34:41', '0000-00-00 00:00:00', '2023-02-01', 1),
(15, '2023-02-02 12:11:05', '0000-00-00 00:00:00', '2023-02-02', 1),
(16, '2023-02-02 12:11:19', '0000-00-00 00:00:00', '2023-02-02', 1),
(18, '2023-02-02 17:10:38', '0000-00-00 00:00:00', '2023-02-02', 1),
(19, '2023-02-02 17:11:25', '0000-00-00 00:00:00', '2023-02-02', 1),
(20, '2023-02-02 17:43:49', '0000-00-00 00:00:00', '2023-02-02', 1),
(21, '2023-02-02 17:45:53', '0000-00-00 00:00:00', '2023-02-02', 1),
(22, '2023-02-02 17:46:37', '0000-00-00 00:00:00', '2023-02-02', 1),
(23, '2023-02-02 17:49:36', '0000-00-00 00:00:00', '2023-02-02', 1),
(24, '2023-02-02 17:51:19', '0000-00-00 00:00:00', '2023-02-02', 1),
(25, '2023-02-02 17:54:25', '0000-00-00 00:00:00', '2023-02-02', 1),
(26, '2023-02-02 18:13:17', '0000-00-00 00:00:00', '2023-02-02', 1),
(27, '2023-02-03 10:33:24', '0000-00-00 00:00:00', '2023-02-03', 1),
(28, '2023-02-03 10:53:14', '0000-00-00 00:00:00', '2023-02-03', 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullname` varchar(150) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `password`) VALUES
(1, 'user example', 'user@sample.com', '$2a$10$2AFpzfEqSvv8WhHvwxcsHeOKAYgxkVQEFfToQDpO6kzsQ0fk5wDUq'),
(8, 'Rivas', 'usuario1@sample.com', '$2a$10$2AFpzfEqSvv8WhHvwxcsHeOKAYgxkVQEFfToQDpO6kzsQ0fk5wDUq'),
(12, 'Rivas', 'usuario1@sample.com', '$2a$10$IMNxnQQlwEJjj9dh0VSho.8s3Z4VTXeeQf9.Oz8W2XhPFHqyvNM2C'),
(17, 'Rivas', 'usuario2@sample.com', '$2a$10$dzk/y55XAPxzhHe1aWvom.oRv9jUFWEVAFf9vPU3cAjlhPTU4v5RS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_roles`
--

CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user_roles`
--

INSERT INTO `user_roles` (`id`, `user_id`, `role_id`) VALUES
(1, 8, 1),
(5, 12, 1),
(6, 1, 2),
(11, 17, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tracker_id` (`tracker_id`);

--
-- Indices de la tabla `time_tracker`
--
ALTER TABLE `time_tracker`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_time` (`user_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_role` (`role_id`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `time_tracker`
--
ALTER TABLE `time_tracker`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `fk_tracker_id` FOREIGN KEY (`tracker_id`) REFERENCES `time_tracker` (`id`);

--
-- Filtros para la tabla `time_tracker`
--
ALTER TABLE `time_tracker`
  ADD CONSTRAINT `fk_user_time` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `fk_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
