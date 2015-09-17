SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données :  `capacityplanner`
--

-- --------------------------------------------------------

--
-- Structure de la table `component`
--

CREATE TABLE IF NOT EXISTS `component` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dashboard_id` tinyint(4) NOT NULL,
  `name` varchar(512) NOT NULL,
  `thresholdWarning` tinyint(4) NOT NULL,
  `thresholdCritic` tinyint(4) NOT NULL,
  `ratioModifier` varchar(128) NOT NULL DEFAULT 'default',
  PRIMARY KEY (`id`),
  KEY `dashboard_id` (`dashboard_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `dashboard`
--

CREATE TABLE IF NOT EXISTS `dashboard` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `element`
--

CREATE TABLE IF NOT EXISTS `element` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `component_id` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `referenceKey` varchar(16) NOT NULL,
  `referenceValue` double unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `component_id` (`component_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `indicator`
--

CREATE TABLE IF NOT EXISTS `indicator` (
  `element_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `value` double unsigned NOT NULL,
  `referenceValue` double unsigned NOT NULL,
  `percent` float NOT NULL,
  PRIMARY KEY (`element_id`,`date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL,
  `login` varchar(128) NOT NULL,
  `pass` varchar(64) NOT NULL,
  `role` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `component`
--
ALTER TABLE `component`
  ADD CONSTRAINT `component_ibfk_1` FOREIGN KEY (`dashboard_id`) REFERENCES `dashboard` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `element`
--
ALTER TABLE `element`
  ADD CONSTRAINT `element_ibfk_1` FOREIGN KEY (`component_id`) REFERENCES `component` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `indicator`
--
ALTER TABLE `indicator`
  ADD CONSTRAINT `indicator_ibfk_1` FOREIGN KEY (`element_id`) REFERENCES `element` (`id`) ON DELETE CASCADE;