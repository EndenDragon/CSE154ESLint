<?php
if (isset($_GET["referer"]) && isset($_SERVER['HTTP_REFERER'])) {
	$ref = $_SERVER['HTTP_REFERER'];
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $ref); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	$html_page = curl_exec($ch);
	
	$dom = new DOMDocument;
	$dom->loadHTML($html_page);
	$scripts = $dom->getElementsByTagName("script");
	$collected_scripts = "";
	foreach ($scripts as $script) {
		if ($script->hasAttribute("src")) {
			$src = $script->getAttribute("src");
			if (substr( $src, 0, 7 ) != "http://" && substr( $src, 0, 8 ) != "https://") {
				$src = $ref . "/./" . $src;
			}
			curl_setopt($ch, CURLOPT_URL, $src);
			$collected_scripts .= "\n" . curl_exec($ch);
		} else {
			$collected_scripts .= "\n" . $script->textContent;
		}
	}
	curl_close($ch);
	echo htmlspecialchars($collected_scripts);
}
?>