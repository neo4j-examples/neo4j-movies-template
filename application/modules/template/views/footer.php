    </body>

    <footer>

    </footer>
<?php 
	$modulo = $this->uri->segment(1);
	if($modulo === NULL || $modulo === "home" || $modulo === 'movie' || $modulo === 'person'){
?>
	<script src="/assets/node_modules/jquery/dist/jquery.min.js"></script>
	<script src="/assets/node_modules/lightslider/src/js/lightslider.js"></script>
	<script src="/assets/js/script_jquery_lightSlider.js"></script>
	<script src="/assets/js/bootstrap.min.js"></script>
<?php
	}
?>
</html>
