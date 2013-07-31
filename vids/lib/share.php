<?php
/**
 * ownCloud
 */

namespace OCA\Vids\Share;

class Vids implements \OCP\Share_Backend {

	public function isValidSource($itemSource, $uidOwner) {
		return is_array(\OC\Files\Cache\Cache::getById($itemSource));
	}

	public function generateTarget($itemSource, $shareWith, $exclude = null) {
		return $itemSource;
	}

	public function formatItems($items, $format, $parameters = null) {
		return $items;
	}
}
