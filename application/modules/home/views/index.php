		

		<div style="margin: 10%;" data-reactroot="" class="nt-app">
		    <nav class="navbar navbar-toggleable-md navbar-inverse fixed-top bg-inverse">
		      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
		        <span class="navbar-toggler-icon"></span>
		      </button>
		      <a class="navbar-brand" href="/">Neo4j Recommendations Movies</a>

		      <div class="collapse navbar-collapse" id="navbarsExampleDefault">
		        <ul class="navbar-nav mr-auto">
		          <li class="nav-item">
		            <a class="nav-link" href="https://github.com/neo4j-examples/neo4j-movies-template">GitHub Original Project</a>
		          </li>
		          <li class="nav-item">
		            <a class="nav-link" href="https://github.com/lucasjovencio/codeigniter-neo4j-movies-template">GitHub Fork Project</a>
		          </li>
		          <li class="nav-item">
		            <a class="nav-link" href="http://neo4j.com/">Neo4j 3.1.0</a>
		          </li>
		        </ul>

		        <form class="form-inline my-2 my-lg-0" method="post" accept-charset="utf-8" action="/home/pesquisa/">
		          <input class="form-control mr-sm-2" name="pesquisa" style="margin: 0%;" type="text" placeholder="Search">
		          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
		        </form>
	            <ul class="navbar-nav mr-auto">
		          <li class="nav-item">
		            <a class="nav-link" href="https://github.com/lucasjovencio/codeigniter-neo4j-movies-template">Log in</a>
		          </li>
		          <li class="nav-item">
		            <a class="nav-link" href="http://neo4j.com/">Sign up</a>
		          </li>
	            </ul>
				</div>
		      </div>
		    </nav>
		</div>
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
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="/assets/js/lightslider.js"></script>
<script src="/assets/js/script_jquery_lightSlider.js"></script>
<script src="/assets/js/bootstrap.min.js"></script>