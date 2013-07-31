<?php

/**
 * Copyright (c) 2013 Francisco Lopez <flopex@live.com> - Baynetwork.com
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */

OCP\JSON::checkLoggedIn();
OCP\JSON::checkAppEnabled('vids');

$videos = \OC\Files\Filesystem::searchByMime('video');
$user = \OC_User::getUser();

foreach ($videos as &$video) {
	$video['path'] = $user . $video['path'];
	$video['rawPath'] = $video['path'];
	
	if (strpos($video['path'],'Shared/')){
	
		$query = \OC_DB::prepare('SELECT `uid_owner` FROM `oc_share` WHERE `file_source` = '.$video['fileid']);
		$result = $query->execute()->fetchRow();
		
		$video['realOwner'] = $result['uid_owner'];	
	
	}else{
	
		$video['realOwner'] = $user;	
	
	}
	
	$query1 = \OC_DB::prepare('SELECT `path` FROM `oc_filecache` WHERE `fileid` = '.$video['fileid']); 
	$result1 = $query1->execute()->fetchRow();
	
	$video['path'] = $video['realOwner'].'/'.$result1['path'];
	
}

$shared = array();
$sharedSources = OCP\Share::getItemsSharedWith('vids');
$users = array();
foreach ($sharedSources as $sharedSource) {
	$owner = $sharedSource['uid_owner'];
	if (array_search($owner, $users) === false) {
		$users[] = $owner;
	}
	\OC\Files\Filesystem::initMountPoints($owner);
	$ownerView = new \OC\Files\View('/' . $owner . '/files');
	$path = $ownerView->getPath($sharedSource['item_source']);
	if ($path) {
		$shareName = basename($path);
		$shareView = new \OC\Files\View('/' . $owner . '/files' . $path);
		$sharedvideos = $shareView->searchByMime('video');
		foreach ($sharedvideos as $sharedvideo) {
			$sharedvideo['path'] = $owner . '/' . $sharedSource['item_source'] . '/' . $shareName . $sharedvideo['path'];
			$videos[] = $sharedvideo;
		}
	}
}

$displayNames = array();
foreach ($users as $user) {
	$displayNames[$user] = \OCP\User::getDisplayName($user);
}

OCP\JSON::setContentTypeHeader();
echo json_encode(array('videos' => $videos, 'users' => $users, 'displayNames' => $displayNames));
