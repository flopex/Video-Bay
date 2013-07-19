<?php

/**
 * Copyright (c) 2013 Francisco Lopez <flopex@live.com> - Baynetwork.com
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */


OCP\JSON::checkLoggedIn();
OCP\JSON::checkAppEnabled('vids');


if (isset($_POST['vidURL']) && !empty($_POST['vidURL']) AND 
	isset($_POST['vidN']) && !empty($_POST['vidN']) AND
	isset($_POST['vidO']) && !empty($_POST['vidO'])){


	$baseURL = \OC_Config::getValue('datadirectory').'/';
	$ownDir = \OC::$SERVERROOT;
	
	$com = 'ffmpeg -y -ss 5 -i "'.$baseURL.$_POST['vidURL'].'" -vcodec png -vframes 1 -an -f rawvideo -vf scale=320:-1 "'.$ownDir.'/apps/vids/stos/'.$_POST['vidO'].'::'.$_POST['vidN'].'.png"';
	
	
	$res = shell_exec($com);
	

}


