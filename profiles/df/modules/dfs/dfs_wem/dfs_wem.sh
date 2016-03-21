# @file dfs_wem.sh

drush en dfs_wem -vy
drush mi DFSWEMInterestsTerms
drush mi DFSWEMUserPictures
drush mi DFSWEMUsers
drush mi DFSWEMProducts
drush mi DFSWEMCommerceNodes
drush mi DFSWEMCommerceNodesTranslations
drush mi DFSWEMProductReviewNodes
drush mi DFSWEMContestNodes
drush mi DFSWEMContestNodesTranslations
drush mi DFSWEMGroupsWEMContestUsers
drush mi DFSWEMNewsVideo
drush mi DFSWEMNewsNodes
drush mi DFSWEMNewsNodesTranslations
drush mi DFSWEMTweetNodes
drush tei-rebuild
