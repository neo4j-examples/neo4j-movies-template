<div class="nt-app-page">
	<div class="nt-person">
		<div>
			<div class="row">
				<div class="large-12 columns">
					<h2 class="nt-person-header"><?= isset ($details['name']) ? $details['name']:'';?>
					</h2>
				</div>
			</div>
			<div class="row">
				<div class="small-12 medium-3 columns nt-person-aside">
					<img class="nt-person-poster" src="<?= isset ($details['img']) ? $details['img']:'';?>">
				</div>
				<div class="small-12 medium-9 columns nt-person-main">
					<div>
						<div class="nt-box">
							<div class="nt-box-title">Bio
							</div>
							<p class="nt-box-row">
								<strong>Born:
								</strong>
								<span><?= isset ($details['born']) ? $details['born']:'';?>
								</span>
							</p>
						</div>
						<div class="nt-box">
							<div class="nt-box-title">Related People
							</div>
							<div class="nt-box-row">
								<div class="nt-carousel">
									<ul id="content-related" class="content-slider">
										<?php foreach ($relatedPeople as $key){?>
										<li class="nt-carousel-item" style="display: inline-block; width: 20%; ";">
											<div>
												<img src="<?= isset ($key['img']) ? $key['img']:'';?>">
													<div class="nt-carousel-actor-name">
	            										<a href="http://localhost/person/p/<?= isset ($key['id']) ? $key['id']:'';?>"><?= isset ($key['name']) ? $key['name']:'';?></a>
	            									</div>
            									</a>
            								</div>
            							</li>
            							<?php } ?>
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
							<ul id="content-related" class="content-slider">
								<?php foreach ($movieActed as $key){?>
								<li class="nt-carousel-item" style="display: inline-block; width: 20%;">
									<div>
										<img src="<?= isset ($key['img']) ? $key['img']:'';?>">
										<div class="nt-carousel-movie-title">
            								<a href="http://localhost/movie/m/<?= isset ($key['id']) ? $key['id']:'';?>"><?= isset ($key['title']) ? $key['title']:'';?>
	            							</div> 
	            							<p class="nt-carousel-movie-role">
	            								<?= isset ($key['role']) ? $key['role']:'';?>
	            							</p>
            							</a>
            						</div>
								</li>
								<?php } ?>	
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>