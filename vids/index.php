<?php

/**
 * (c) 2013 Francisco Lopez <flopex@live.com> - Baynetwork.com
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */

OCP\User::checkLoggedIn();
OCP\App::checkAppEnabled('vids');
OCP\App::setActiveNavigationEntry('vids_index');

OCP\Util::addStyle('files', 'files');
OCP\Util::addscript('files', 'jquery.iframe-transport');
OCP\Util::addscript('files', 'jquery.fileupload');
OCP\Util::addscript('files', 'files');
OCP\Util::addscript('files', 'filelist');
OCP\Util::addscript('files', 'fileactions');
OCP\Util::addscript('files', 'keyboardshortcuts');
OCP\Util::addScript('vids', 'vids');
OCP\Util::addScript('vids', 'css_browser_selector');
OCP\Util::addStyle('vids','style');

$tmpl = new OCP\Template('vids', 'index', 'user');
$tmpl->printPage();