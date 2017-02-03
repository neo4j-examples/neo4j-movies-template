<div class="nt-app-page">
	<div class="nt-person">
		<div>
			<div class="row">
				<div class="large-12 columns">
					<h2 class="nt-person-header"><?= isset ($details['name']) ? $details['name']:'#';?>
					</h2>
				</div>
			</div>
			<div class="row">
				<div class="small-12 medium-3 columns nt-person-aside">
					<img class="nt-person-poster" src="<?= isset ($details['img']) ? $details['img']:'#';?>">
				</div>
				<div class="small-12 medium-9 columns nt-person-main">
					<div>
						<div class="nt-box">
							<div class="nt-box-title">Bio
							</div>
							<p class="nt-box-row">
								<strong>Born:
								</strong>
								<span><?= isset ($details['born']) ? $details['born']:'#';?>
								</span>
							</p>
						</div>
						<div class="nt-box">
							<div class="nt-box-title">Related People
							</div>
							<div class="nt-box-row">
								<div class="nt-carousel">
									<button   class="nt-carousel-right">
										<span class="nt-carousel-arrow">❱
										</span>
									</button>
									<button class="nt-carousel-left">
										<span class="nt-carousel-arrow">❰
										</span>
									</button>
									<ul id="content-related" class="content-slider">
										<?php echo($relatedPeople);?>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row nt-person-movies">
				<div class="large-12 columns">
					<div class="nt-box">
						<div class="nt-box-title">Acted In</div>
						<div class="nt-carousel">
							<button   class="nt-carousel-right">
								<span class="nt-carousel-arrow">❱
								</span>
							</button>
							<button class="nt-carousel-left">
								<span class="nt-carousel-arrow">❰
								</span>
							</button>
							<ul id="content-related" class="content-slider">
								<?php echo($movieActed);?>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="/assets/js/lightslider.js"></script>
<script src="/assets/js/script_jquery_lightSlider.js"></script>
<script src="/assets/js/bootstrap.min.js"></script>