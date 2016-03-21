<?php

/**
 * Implements hook_block_info().
 *
 * This implements different blocks for dfs_valen scenario.
 */
function dfs_med_base_block_info() {
  $blocks['dfs_med_base_user_header'] = array(
    'info' => t('User info block'),
  );
  return $blocks;
}

/**
 * Implements hook_block_view().
 */
function dfs_med_base_block_view($delta = '') {
  switch ($delta) {
    case 'dfs_med_base_user_header':
      $block['subject'] = t('');
      global $user;
      if (!in_array('anonymous user', $user->roles)) {
        $block['content'] = '
          <div class="user-header-block">
            <div class="uh-container">
                <a data-dropdown="drop1" class="user-name med-user parent">' . $user->name  . '</a>
                <ul id="drop1" class="f-dropdown" data-dropdown-content>
                    <li class="dropdown"><a href="/user">My Profile</a>
                    </li>
                    <li class="dropdown"><a href="/user/logout">Logout</a>
                    </li>
                </ul>
            </div>
            <div class="uh-container">
                | <a class="shows" href="/user/' . $user->uid  . '/my-shows">My Shows</a>
            </div>
          </div>
        ';
      }
      else {
        $block['content'] = '
            <div class="user-header-block">
                <div class="uh-container">
                    <a data-dropdown="drop2" class="user-name med-user parent">Login / Register</a>
                    <ul id="drop2" class="f-dropdown" data-dropdown-content>
                        <li class="dropdown"><a href="/user/login">Login</a>
                        </li>
                        <li class="dropdown"><a href="/user/register">Sign-up</a>
                        </li>
                    </ul>
                </div>
            </div>
        ';
      }    
      break;
  }
  if (isset($block)) {
    return $block;
  }
}


