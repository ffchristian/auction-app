-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-12-2015 a las 02:18:06
-- Versión del servidor: 10.1.9-MariaDB
-- Versión de PHP: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `auction-app-bd`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `idItem` int(11) NOT NULL,
  `cant` int(11) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `inventory`
--

INSERT INTO `inventory` (`id`, `id_user`, `idItem`, `cant`, `create_at`) VALUES
(1, 32, 1, 20, '2015-12-28 00:35:01'),
(2, 32, 2, 10, '2015-12-28 00:35:01'),
(3, 32, 3, 1, '2015-12-28 00:35:01'),
(4, 33, 1, 30, '2015-12-28 00:35:12'),
(5, 33, 2, 26, '2015-12-28 00:35:12'),
(6, 33, 3, 1, '2015-12-28 00:35:12'),
(7, 34, 1, 40, '2015-12-28 00:37:13'),
(8, 34, 2, 26, '2015-12-28 00:37:13'),
(9, 34, 3, 1, '2015-12-28 00:37:13'),
(10, 35, 1, 30, '2015-12-28 00:54:53'),
(11, 35, 2, 10, '2015-12-28 00:54:53'),
(12, 35, 3, 1, '2015-12-28 00:54:53'),
(13, 36, 1, 30, '2015-12-28 00:59:13'),
(14, 36, 2, 18, '2015-12-28 00:59:13'),
(15, 36, 3, 1, '2015-12-28 00:59:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `name` varchar(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `items`
--

INSERT INTO `items` (`id`, `name`, `image`, `created_at`) VALUES
(1, 'bread', 'http://pngimg.com/upload/bread_PNG2278.png', '2015-12-27 23:21:44'),
(2, 'carrot', 'http://www.juicetherapy.co.uk/wp-content/uploads/2014/08/carrots.png', '2015-12-27 23:21:44'),
(3, 'diamond', 'http://tvcom.technologyvista.netdna-cdn.com/wp-content/uploads/2015/12/diamond-2.jpg', '2015-12-27 23:21:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` text NOT NULL,
  `coins` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `coins`, `created_at`) VALUES
(32, 'christian', 1024, '2015-12-28 00:35:01'),
(33, 'user2', 984, '2015-12-28 00:35:11'),
(34, 'user3', 969, '2015-12-28 00:37:13'),
(35, 'user1', 1016, '2015-12-28 00:54:52'),
(36, 'newuser', 1007, '2015-12-28 00:59:13');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `idItem` (`idItem`);

--
-- Indices de la tabla `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT de la tabla `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`idItem`) REFERENCES `items` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
