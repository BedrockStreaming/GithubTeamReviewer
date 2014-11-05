# dependecies for node
class { 'nodejs':
  version => 'stable',
  make_install => false
} ->

# essentials package

package { 'git':
    ensure => present
} ->

package { 'vim':
    ensure => present
} ->

# npm modules

package { 'gulp':
  ensure => present,
  provider => 'npm',
  require  => Class['nodejs']
} ->

package { 'bower':
  ensure => present,
  provider => 'npm',
  require  => Class['nodejs']
}
