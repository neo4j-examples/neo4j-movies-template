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
										<?php foreach ($feature as $key){?>
										<li class="nt-carousel-item" style="display: inline-block; width: 20%;">
											<div>
												<img src="<?= isset ($key['img']) ? $key['img']:'';?>"></a>
												<div class="nt-carousel-movie-title">
													<a href="http://localhost/movie/m/<?= isset ($key['id']) ? $key['id']:'';?>"><?= isset ($key['title']) ? $key['title']:'';?></a>
												</div>
											</div>
										</li>
										<?php }	?>
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
											<ul id="content-action" class="content-slider">
												<?php foreach ($action as $key){?>
												<li class="nt-carousel-item" style="display: inline-block; width: 20%;">
													<div>
														<img src="<?= isset ($key['img']) ? $key['img']:'';?>"></a>
														<div class="nt-carousel-movie-title">
															<a href="http://localhost/movie/m/<?= isset ($key['id']) ? $key['id']:'';?>"><?= isset ($key['title']) ? $key['title']:'';?></a>
														</div>
													</div>
												</li>
												<?php }	?>
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
											<ul id="content-drama" class="content-slider">
												<?php foreach ($drama as $key){?>
												<li class="nt-carousel-item" style="display: inline-block; width: 20%;">
													<div>
														<img src="<?= isset ($key['img']) ? $key['img']:'';?>"></a>
														<div class="nt-carousel-movie-title">
															<a href="http://localhost/movie/m/<?= isset ($key['id']) ? $key['id']:'';?>"><?= isset ($key['title']) ? $key['title']:'';?></a>
														</div>
													</div>
												</li>
												<?php }	?>
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
											<ul id="content-fantasy" class="content-slider">
												<?php foreach ($Fantasy as $key){?>
												<li class="nt-carousel-item" style="display: inline-block; width: 20%;">
													<div>
														<img src="<?= isset ($key['img']) ? $key['img']:'';?>"></a>
														<div class="nt-carousel-movie-title">
															<a href="http://localhost/movie/m/<?= isset ($key['id']) ? $key['id']:'';?>"><?= isset ($key['title']) ? $key['title']:'';?></a>
														</div>
													</div>
												</li>
												<?php }	?>
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
