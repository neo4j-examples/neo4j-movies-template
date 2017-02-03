			<div style="margin: 10%;"></div>
			<div id="app">
				<!-- Aqui termina o header e inicia o corpo da pagina -->
				<div class="nt-app-page">
					<div class="nt-home">
						<div class="row">
							<div class="large-12 columns">
								<div class="nt-home-featured">
									<h3 class="nt-home-header">Featured Movies</h3>
									<ul>
										<?php echo($feature); ?>
									</ul>
								</div>
							</div>
							<div class="large-12 columns">
								<div class="nt-home-by-genre">
									<div class="nt-box">
										<div class="nt-box-title">
											Action
										</div>
										<div class="nt-carousel">
											<button   class="nt-carousel-right">
												<span class="nt-carousel-arrow">❱
												</span>
											</button>
											<button class="nt-carousel-left">
												<span class="nt-carousel-arrow">❰
												</span>
											</button>
											<ul id="content-action" class="content-slider">
											</button>
													<?php echo($action); ?>
												<!-- Acrescentar novos LI para cada filme -->
											</ul>
										</div>
									</div>
								</div>
								<div class="nt-home-by-genre">
									<div class="nt-box">
										<div class="nt-box-title">
											Drama
										</div>
										<div class="nt-carousel">
											<button   class="nt-carousel-right">
												<span class="nt-carousel-arrow">❱
												</span>
											</button>
											<button class="nt-carousel-left">
												<span class="nt-carousel-arrow">❰
												</span>
											</button>
											<ul id="content-drama" class="content-slider">
												<?php echo($drama);?>
												<!-- Acrescentar novos LI para cada filme -->
											</ul>
										</div>
									</div>
								</div>
								<div class="nt-home-by-genre">
									<div class="nt-box">
										<div class="nt-box-title">
											Fantasy
										</div>
										<div class="nt-carousel">
											<button   class="nt-carousel-right">
												<span class="nt-carousel-arrow">❱
												</span>
											</button>
											<button class="nt-carousel-left">
												<span class="nt-carousel-arrow">❰
												</span>
											</button>
											<ul id="content-fantasy" class="content-slider">
												<?php echo($Fantasy) ?>
												<!-- Acrescentar novos LI para cada filme -->
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="notification-container">
				</div>
			</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="/assets/js/lightslider.js"></script>
<script src="/assets/js/script_jquery_lightSlider.js"></script>
<script src="/assets/js/bootstrap.min.js"></script>