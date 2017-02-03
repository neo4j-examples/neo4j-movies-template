<div id="app">
		<div class="nt-app-page">
			<div class="nt-movie">
				<div>
									<?php 
										echo($details); 
										echo($genre);
										echo($directed); 
										echo($written);
										echo($produced);
									?>
								</div>
								<div class="nt-box">

									<div class="nt-box-title">Cast
									</div>
									<div>
										<div class="nt-carousel">
											<button   class="nt-carousel-right">
												<span class="nt-carousel-arrow">❱
												</span>
											</button>
											<button class="nt-carousel-left">
												<span class="nt-carousel-arrow">❰
												</span>
											</button>
											<ul id="content-cast" class="content-slider">
												<?php echo($cast); ?>
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
									<button   class="nt-carousel-right">
										<span class="nt-carousel-arrow">❱
										</span>
									</button>
									<button class="nt-carousel-left">
										<span class="nt-carousel-arrow">❰
										</span>
									</button>
									<ul id="content-related" class="content-slider">
										<?php echo($related); ?>
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