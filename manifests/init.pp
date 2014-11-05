# dependecies for node
package { 'g++':
    ensure => present
} ->

package { 'make':
    ensure => present
}

include nodejs

# essentials package

package { 'git':
    ensure => present
} ->

package { 'vim':
    ensure => present
} ->

# npm modules

package { 'gulp':
  provider => npm
} ->
package { 'bower':
  provider => npm
}
