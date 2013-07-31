<?php

/**
 * Copyright (c) 2013 Francisco Lopez <flopex@live.com> - Baynetwork.com
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */

OC::$CLASSPATH['OCA\Vids\Share\Video'] = 'vids/lib/share.php';
OC::$CLASSPATH['OCA\Vids\Share\Vids'] = 'vids/lib/share.php';

$l = OC_L10N::get('vids');

OCP\App::addNavigationEntry(array(
		'id' => 'vids_index',
		'order' => 1,
		'href' => OCP\Util::linkTo('vids', 'index.php'),
		'icon' => OCP\Util::linkTo('vids', 'img/video.svg'),
		'name' => $l->t('Videos'))
);


OCP\Share::registerBackend('vids', 'OCA\Vids\Share\Vids', 'video');