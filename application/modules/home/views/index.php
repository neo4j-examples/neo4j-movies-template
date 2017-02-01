		<div id="app">
			<div data-reactroot="" class="nt-app">
				<nav class="nt-app-header">
					<div class="nt-app-header-logo">
						<a href="http://localhost/">
							<img src="/assets/img/logos/logo_index.png"></a>
					</div>
					<ul class="nt-app-header-links">
						<li>
							<a class="nt-app-header-link" href="https://github.com/neo4j-examples/neo4j-movies-template" target="_blank">GitHub Original Project</a>
						</li>
						<li>
							<a class="nt-app-header-link" href="https://github.com/lucasjovencio/codeigniter-neo4j-movies-template" target="_blank">GitHub Fork Project</a>
						</li>
						<li>
							<a class="nt-app-header-link" href="http://neo4j.com/" target="_blank">Neo4j 3.1.0</a>
						</li>
					</ul>
					<div class="nt-app-header-profile-links">
						<div class="right">
							<div class="log-container">
								<a href="#">
									Log in
								</a>
							</div>
							<div>
								<a href="http://192.168.111.129:4000/signup">Sign up</a>
							</div>
							<div>

							</div>
						</div>
					</div>
				</nav>
				<ul class="breadcrumbs">
					<li>
						<a class="current" href="http://localhost/">Home</a>
					</li>
				</ul>

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
											<ul id="content-action" class="content-slider">
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
		</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="/assets/js/lightslider.js"></script>
<script src="/assets/js/script_jquery_lightSlider.js"></script>