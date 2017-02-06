<div id="app">
		<div class="nt-app-page">
			<div class="nt-movie">
				<div>
					<div class="row">
                    	<div class="large-12 columns">
                    		<h2 class="nt-movie-title">
                    			<?= isset ($details['title']) ? $details['title']:'';?>
                    		</h2>
                       </div>
                    </div>
                    <div class="row">
                    	<div class="small-12 medium-4 columns nt-movie-aside">
                			<img class="nt-movie-poster" src="<?= isset ($details['img']) ? $details['img']:'';?>">
                			<div class="nt-box">
               		 			<div class="nt-box-title">Storyline</div>
                				<p class="nt-box-row">
                        			<strong>Tagline:</strong>
                        			<span>
                        				<?= isset ($details['tagline']) ? $details['tagline']:'';?>
									</span>
                				</p>
                				<p class="nt-box-row">
                    				<strong>Keywords:</strong>
                    				<span>
                        
                    				</span>
                				</p>
           					</div>
            			</div>
			            <div class="small-12 medium-8 columns nt-movie-main">
			                <div>
			                    <div class="nt-box">
			                        <div class="nt-box-title">Movie Details
			                        </div>
			                        <p class="nt-box-row">
			                            <strong>Rated: 
			                            </strong>
			                            <span>
			                            	<?= isset ($details['rated']) ? $details['rated']:'';?>
 										</span>
                        			</p>
                        			<p class="nt-box-row">
                            			<strong>Duration:</strong>
                            			<span>
                            				<?= isset ($details['duration']) ? $details['duration']:'';?> mins
              							</span>
                        			</p>
                      				<p class="nt-box-row">
                    					<strong>Genres:</strong>
                    					<span>
                    						<?php foreach ($genre as $key){?>
            								<span>
                								<?= isset ($key['name']) ? $key['name']:'';?>
            									<span>
            										<?= isset ($key[',']) ? $key[',']:'';?>
            									</span>
            								</span>
                    						<?php } ?>
                    					</span>
                    				</p>
               						<p class="nt-box-row">
					                    <strong>Directed By:</strong>
					                    <span>
                    						<?php foreach ($directed as $key){?>
            								<span>
            									<a href="http://localhost/person/p/<?= isset ($key['id']) ? $key['id']:'';?>" > <?= isset ($key['name']) ? $key['name']:'';?></a>
            									<span>
            										<?= isset ($key[',']) ? $key[',']:'';?>
            									</span>
                							</span>
                    						<?php }	?>
					                    </span>
					                    
					                </p>
               						<p class="nt-box-row">
					                    <strong>Written By: </strong>
					                    <span>
                    				    <?php 
                    					foreach ($written as $key){ ?>
            								<span>
            									<a href="http://localhost/person/p/<?= isset ($key['id']) ? $key['id']:'';?>" > <?= isset ($key['name']) ? $key['name']:'';?></a>
            									<span>
            										<?= isset ($key[',']) ? $key[',']:'';?>
            									</span>
            								</span>
                    					<?php } ?>
					                    </span>
					                </p>
               						<p class="nt-box-row">
					                    <strong>Produced By: </strong>
					                    <span>
                    						<?php foreach ($produced as $key){?>
            								<span>
            									<a href="http://localhost/person/p/<?= isset ($key['id']) ? $key['id']:'';?>" > <?= isset ($key['name']) ? $key['name']:'';?></a>
            									<span>
            										<?= isset ($key[',']) ? $key[',']:'';?>
            									</span>
            								</span>
                    						<?php } ?>
					                    </span>
					                </p>
								</div>
								<div class="nt-box">
									<div class="nt-box-title">Cast
									</div>
									<div>
										<div class="nt-carousel">
											<ul id="content-cast" class="content-slider">
                    						    <?php foreach ($cast as $key){?>
												<li class="nt-carousel-item" style="display: inline-block; width: 20%; ";">
													<div>
														<img src="<?= isset ($key['img']) ? $key['img']:'';?>">
															<div class="nt-carousel-actor-name">
		            											<a href="http://localhost/person/p/<?= isset ($key['id']) ? $key['id']:'';?>"><?= isset ($key['name']) ? $key['name']:'';?>
		            										</div> 
			            										<p class="nt-carousel-actor-name">
			            										<?= isset ($key['role']) ? $key['role']:'';?>
			            										</p>
			            									</a>
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
						<div class="small-12 columns">
							<div class="nt-box">
								<div class="nt-box-title">Related
								</div>
								<div class="nt-carousel">
									<ul id="content-related" class="content-slider">
                                        <?php foreach ($related as $key){?>
										<li class="nt-carousel-item" style="display: inline-block; width: 20%; ";">
                                            <div>
                                                <img src="<?= isset ($key['img']) ? $key['img']:'';?>"></a>
                                                <div class="nt-carousel-actor-name">
                                                    <a href="http://localhost/movie/m/<?= isset ($key['id']) ? $key['id']:'';?>"><?= isset ($key['title']) ? $key['title']:'';?></a>
                                                </div>
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
		<div class="notification-container">
			
		</div>
	</div>
</div>