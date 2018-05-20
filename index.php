<!DOCTYPE html>
<html>
	<head>
	    <meta charset="utf-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<title>UW CSE 154 JavaScript Lint Validator</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
		<link href="jslint.css" type="text/css" rel="stylesheet" />
	</head>
	
	<body class="container text-center">
		<h1>UW CSE 154 JavaScript Lint</h1>
		
		<p id="version">Version: Jeremy Zhang 2018-05-16 (using ESLint)</p>
		
		<?php if (isset($_GET["referer"]) && !isset($_SERVER['HTTP_REFERER'])): ?>
		<div class="alert alert-danger" role="alert">
		    <strong>ERROR: No HTTP referer site was found.</strong>
            <br>
            You cannot run JSLint in 'referer' mode if the page is on your local hard drive.
            The page must be located on a public web server,
            then browse to the page on the server and click your JSLint image.
		</div>
		<?php endif; ?>

		<div class="card border-primary mb-3">
			<div class="card-body text-primary">
				<div id="input"><?php include("referer.php"); ?></div>
			</div>
		</div>

		<div class="card border-dark mb-3">
			<div class="card-header">Options</div>
			<div class="card-body text-primary">
				<form>
					<div class="form-group row">
						<label for="option-tab-size-select" class="col-sm-2 col-form-label">Tab Size Setting</label>
						<div class="col-sm-10">
							<select class="form-control" id="option-tab-size-select">
								<option value="2">2</option>
								<option value="3" selected="selected">3</option>
								<option value="4">4</option>
								<option value="6">6</option>
								<option value="8">8</option>
							</select>
						</div>
					</div>
				</form>
			</div>
		</div>

		<div>
			<button type="button" class="btn btn-primary btn-lg" id="run">Run JSLint</button>
		</div>
		
		<br>
		
		<div>
			<div class="card text-white bg-success mb-3" id="success-card" style="display: none;">
				<div class="card-header">Validation Successful!</div>
				<div class="card-body">
					<h5 class="card-title">Success</h5>
					<p class="card-text">No errors found. Good work!</p>
				</div>
			</div>
			<div class="card text-white bg-danger mb-3" id="error-card" style="display: none;">
				<div class="card-header">Validation Error!</div>
				<div class="card-body">
					<h5 class="card-title">Errors</h5>
					<p class="card-text">These are items that JSLint doesn't like about your code. You should correct these issues in your code and try again.</p>
				</div>
				<ul class="list-group list-group-flush text-dark">
					<li class="list-group-item">
						<span class="badge badge-info badge-pill float-right">no-unused-vars</span>
						<strong>line 1, column 10</strong>: 'addOne' is defined but never used. <br>
<pre><code>
function addOne(i) {
         ^^^^^^^
</code></pre>
					</li>
					<li class="list-group-item">
						<span class="badge badge-info badge-pill float-right">no-else-return</span>
						<strong>line 4, column 12</strong>: Unnecessary 'else' after 'return'. <br>
<pre><code>
    } else {
   ^^^
</code></pre>
					</li>
				</ul>
			</div>
			<div class="card text-white bg-warning mb-3" id="warn-card" style="display: none;">
				<div class="card-header">Validation Warning!</div>
				<div class="card-body">
					<h5 class="card-title">Warnings</h5>
					<p class="card-text">
						These are other items and information that JSLint noticed about your code.
						These are NOT errors, and you may not need to fix them. Some of them might indicate possible problems or bugs.
						You may want to look at these to make sure they are not bugs or mistakes in your code.
					</p>
				</div>
				<ul class="list-group list-group-flush text-dark">
					<li class="list-group-item">
						<span class="badge badge-info badge-pill float-right">no-unused-vars</span>
						<strong>line 1, column 10</strong>: 'addOne' is defined but never used. <br>
<pre><code>
function addOne(i) {
         ^^^^^^^
</code></pre>
					</li>
					<li class="list-group-item">
						<span class="badge badge-info badge-pill float-right">no-else-return</span>
						<strong>line 4, column 12</strong>: Unnecessary 'else' after 'return'. <br>
<pre><code>
    } else {
   ^^^
</code></pre>
					</li>
				</ul>
			</div>
		</div>

		<p>
			<a href="https://eslint.org/">Original version of ESLint</a> by the JS Foundation. Download our <a href="./eslint-config.json">ESLint configuration</a>
			and run ESLint on your own <a href="https://eslint.org/docs/user-guide/integrations">integrations</a>!
		</p>
		
		<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.15/require.min.js" data-main="requireConfig"></script>
		<script src="https://cdn.jsdelivr.net/npm/ace-editor-builds@1.2.4/src-min-noconflict/ace.js"></script>
		<script>
			const ESLINT_OPTIONS = <?php echo file_get_contents("eslint-config.json"); ?>;
		</script>
		<script src="jslint.js"></script>
	</body>
</html>

