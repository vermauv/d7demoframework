<?php
/**
 * @file df-admin-page.tpl.php
 */
?>

<div class="dfs-wrapper">
  <?php foreach ($scenarios as $scenario): ?>
    <div class="dfs-item">
      <?php if (isset($scenario['screenshot'])): ?>
        <div class="dfs-screenshot"><img src="<?php echo $scenario['screenshot']; ?>"></div>
      <?php endif; ?>
      <h4 class="dfs-name"><?php echo $scenario['name']; ?></h4>
      <div class="dfs-description"><?php echo $scenario['description']; ?></div>
      <div class="dfs-link-wrapper">
        <?php foreach ($scenario['links'] as $link): ?>
          <div class="dfs-link button"><?php echo $link; ?></div>
        <?php endforeach ?>
        <?php if (isset($scenario['help'])): ?><div class="dfs-link button"><?php echo $scenario['help']; ?></div><?php endif; ?>
      </div>
    </div>
  <?php endforeach; ?>
</div>
